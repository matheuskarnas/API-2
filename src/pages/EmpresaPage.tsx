import { useNavigate, useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

interface StatsState {
  usuarios: Record<string, number>;
  lojas: Record<string, number>;
  comunidades: Record<string, number>;
  cidades: Record<string, number>;
  familiasImpactadas: Record<string, number>;
}

interface LocationData {
  coordenadas: { lat: number; lng: number };
  lojasCount: number;
  comunidadesCount: number;
  localizacaoId: number;
}

function agruparPorData(array: { data: string }[]): Record<string, number> {
  return array.reduce((acc, item) => {
    acc[item.data] = (acc[item.data] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function formatarData(dateString: string): string {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function EmpresaPage() {
  const navigate = useNavigate();
  const { empresaUrl } = useParams();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any>(null);
  const [stats, setStats] = useState<StatsState>({
    usuarios: {},
    lojas: {},
    comunidades: {},
    cidades: {},
    familiasImpactadas: {}
  });
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    const verificarEmpresa = async () => {
      try {
        if (!empresaUrl) {
          navigate("/error");
          return;
        }

        const { data, error } = await supabase
          .from("patrocinadores")
          .select("*")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (error || !data) throw new Error("Empresa não encontrada");
        setDados(data);
        return data;
      } catch (err) {
        console.error("Falha ao verificar empresa:", err);
        navigate("/error");
        return null;
      }
    };

    verificarEmpresa();
  }, [empresaUrl, navigate]);

  useEffect(() => {
    const buscarDadosCompletos = async () => {
      if (!dados?.id) return;

      try {
        setLoading(true);
        
        setStats({
          usuarios: {},
          lojas: {},
          comunidades: {},
          cidades: {},
          familiasImpactadas: {}
        });
        setLocations([]);

        const { data: usuariosPatrocinados } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id, data_inicio")
          .eq("patrocinador_id", dados.id)
          .is("data_fim", null);

        const usuariosIds = usuariosPatrocinados?.map(u => u.usuario_id) || [];
        if (usuariosIds.length === 0) return;

        const [
          { data: lojasData },
          { data: comunidadesUsuarios },
          { data: amizadesData },
          { data: comunidadesData }
        ] = await Promise.all([
          supabase.from("lojas").select("id,usuario_id,data_criacao,localizacao_id").in("usuario_id", usuariosIds),
          supabase.from("usuarios_comunidades").select("comunidade_id,usuario_id,data_ingresso").in("usuario_id", usuariosIds),
          supabase.from("amizades").select("usuario_id,amigo_id,data_criacao").in("usuario_id", usuariosIds),
          supabase.from("comunidades").select("id,data_criacao,localizacao_id")
        ]);

        const locationsMap: Record<number, LocationData> = {};
        const localizacaoIds = new Set<number>();

        lojasData?.forEach(loja => {
          if (loja.localizacao_id) {
            localizacaoIds.add(loja.localizacao_id);
          }
        });

        if (comunidadesUsuarios && comunidadesUsuarios.length > 0) {
          const comunidadeIds = [...new Set(comunidadesUsuarios.map(uc => uc.comunidade_id))];
          comunidadesData?.forEach(com => {
            if (com.localizacao_id) {
              localizacaoIds.add(com.localizacao_id);
            }
          });
        }

        if (localizacaoIds.size > 0) {
          const { data: localizacoes, error: locError } = await supabase
            .from("localizacoes")
            .select("id, coordenadas")
            .in("id", Array.from(localizacaoIds));

          if (!locError && localizacoes) {
            localizacoes.forEach(loc => {
              locationsMap[loc.id] = {
                coordenadas: loc.coordenadas,
                lojasCount: 0,
                comunidadesCount: 0,
                localizacaoId: loc.id
              };
            });

            lojasData?.forEach(loja => {
              if (loja.localizacao_id && locationsMap[loja.localizacao_id]) {
                locationsMap[loja.localizacao_id].lojasCount += 1;
              }
            });

            if (comunidadesUsuarios && comunidadesUsuarios.length > 0) {
              comunidadesData?.forEach(com => {
                if (com.localizacao_id && locationsMap[com.localizacao_id]) {
                  const userCount = comunidadesUsuarios.filter(
                    uc => uc.comunidade_id === com.id
                  ).length;
                  locationsMap[com.localizacao_id].comunidadesCount += userCount;
                }
              });
            }

            setLocations(Object.values(locationsMap));
          }
        }

        const familiasPorData: Record<string, number> = {};

        usuariosPatrocinados?.forEach(u => {
          const data = formatarData(u.data_inicio);
          familiasPorData[data] = (familiasPorData[data] || 0) + 1;
        });

        amizadesData?.forEach(a => {
          const data = formatarData(a.data_criacao);
          familiasPorData[data] = (familiasPorData[data] || 0) + 1;
        });

        const comunidadesUnicas = [...new Set(comunidadesUsuarios?.map(c => c.comunidade_id) || [])];
        
        for (const comunidadeId of comunidadesUnicas) {
          const { count: totalMembros } = await supabase
            .from("usuarios_comunidades")
            .select("*", { count: "exact", head: true })
            .eq("comunidade_id", comunidadeId);

          const usuariosNestaComunidade = comunidadesUsuarios?.filter(
            c => c.comunidade_id === comunidadeId
          ) || [];

          usuariosNestaComunidade.forEach(c => {
            const data = formatarData(c.data_ingresso);
            familiasPorData[data] = (familiasPorData[data] || 0) + (totalMembros || 0);
          });
        }

        setStats({
          usuarios: agruparPorData((usuariosPatrocinados ?? []).map(u => ({ data: formatarData(u.data_inicio) }))),
          lojas: agruparPorData((lojasData ?? []).map(l => ({ data: formatarData(l.data_criacao) }))),
          comunidades: agruparPorData((comunidadesUsuarios ?? []).map(c => ({ data: formatarData(c.data_ingresso) }))),
          cidades: { [formatarData(new Date().toString())]: localizacaoIds.size },
          familiasImpactadas: familiasPorData
        });

      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosCompletos();
  }, [dados]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex-none bg-[#16254D] min-[500px]:px-2 sticky top-0 z-10">
        <Header empresa={dados} loading={loading} />
      </div>

      <div className="flex-1 flex flex-col justify-evenly gap-8 md:gap-28 overflow-hidden pt-8 pb-10">
        <div className="flex-none">
          <EmpresaInfos empresa={dados} />
        </div>

        <div className="flex-none">
          <Stats
            loading={loading}
            usuarios={stats.usuarios}
            lojas={stats.lojas}
            comunidades={stats.comunidades}
            cidades={stats.cidades}
            familiasImpactadas={stats.familiasImpactadas}
          />
        </div>

        <div className="flex">
          <Maps locations={locations} loading={loading} />
        </div>
      </div>
    </div>
  );
}