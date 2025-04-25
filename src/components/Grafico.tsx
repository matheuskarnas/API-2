import { useEffect, useState } from "react";
import {CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line} from "recharts";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} from "date-fns";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface GraficoProps {
  tipo: "lojas_criadas" | "familias_impactadas" | "cidades_impactadas" |"comunidades";
}

const Grafico = ({ tipo }: GraficoProps) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dadosTotais, setDadosTotais] = useState<{ data: string; valor: number }[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<{ data: string; valor: number }[]>([]);
  const [filtroData, setFiltroData] = useState('');
  const { empresaUrl } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: patrocinador, error: errPat } = await supabase
          .from("patrocinadores")
          .select("id")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (errPat || !patrocinador) throw new Error("Patrocinador não encontrado");

        const { data: usuariosPatrocinados, error: errUsuarios } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id")
          .eq("patrocinador_id", patrocinador.id);

        if (errUsuarios) throw errUsuarios;

        const usuariosIds = usuariosPatrocinados?.map((u) => u.usuario_id) || [];

        if (usuariosIds.length === 0) {
          setDadosTotais([]);
          setDadosFiltrados([]);
          return;
        }

        let dados: { data: string; valor: number }[] = [];

        switch (tipo) {
          case "lojas_criadas": {
            const { data: lojas, error } = await supabase
              .from("lojas")
              .select("data_criacao")
              .in("usuario_id", usuariosIds);

            if (error) throw error;

            const agrupado = lojas.reduce((acc: Record<string, number>, loja) => {
              const data = loja.data_criacao?.slice(0, 10);
              if (data) acc[data] = (acc[data] || 0) + 1;
              return acc;
            }, {});

            let acumulado = 0;
            dados = Object.entries(agrupado)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([data, valor]) => {
                acumulado += valor;
                return { data, valor: acumulado };
              });
            break;
          }

          case "familias_impactadas": {          
            const { data: comunidadesUsuarios, error: comunidadesError } = await supabase
              .from("usuarios_comunidades")
              .select("comunidade_id, usuario_id, data_ingresso")
              .in("usuario_id", usuariosIds);
          
            if (comunidadesError) throw comunidadesError;
          
            const comunidadesUnicas = [...new Set(comunidadesUsuarios?.map(c => c.comunidade_id) || [])];
          
            const impactosPorData: Record<string, number> = {};
          
            for (const comunidadeId of comunidadesUnicas) {
              const { data: todosMembros, count: totalMembros } = await supabase
                .from("usuarios_comunidades")
                .select("usuario_id, data_ingresso", { count: "exact" })
                .eq("comunidade_id", comunidadeId);
          
              if (!todosMembros || totalMembros === null) continue;
          
              const membrosPatrocinados = todosMembros.filter(m =>
                usuariosIds.includes(m.usuario_id)
              );
          
              for (const membro of membrosPatrocinados) {
                const data = membro.data_ingresso?.split("T")[0];
                if (!data) continue;
          
                impactosPorData[data] = (impactosPorData[data] || 0) + totalMembros;
              }
            }
          
            const { data: amizades } = await supabase
              .from("amizades")
              .select("data_criacao")
              .in("usuario_id", usuariosIds);
          
            amizades?.forEach((amizade) => {
              const data = amizade.data_criacao?.split("T")[0];
              if (!data) return;
              impactosPorData[data] = (impactosPorData[data] || 0) + 1;
            });
          
            let acumulado = 0;
            dados = Object.entries(impactosPorData)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([data, valor]) => {
                acumulado += valor;
                return { data, valor: acumulado };
              });
            break;
          }          

          case "cidades_impactadas": {
            const { data: lojas, error: lojasError } = await supabase
              .from("lojas")
              .select("localizacao_id, data_criacao")
              .in("usuario_id", usuariosIds);
          
            if (lojasError) throw lojasError;
          
            const primeiraOcorrencia: Record<string, string> = {};
          
            lojas?.forEach(loja => {
              const locId = loja.localizacao_id;
              const data = loja.data_criacao?.slice(0, 10);
          
              if (!locId || !data) return;
          
              if (!primeiraOcorrencia[locId] || data < primeiraOcorrencia[locId]) {
                primeiraOcorrencia[locId] = data;
              }
            });
          
            const contadorPorData: Record<string, number> = {};
          
            Object.values(primeiraOcorrencia).forEach(data => {
              contadorPorData[data] = (contadorPorData[data] || 0) + 1;
            });
          
            let acumulado = 0;
            dados = Object.entries(contadorPorData)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([data, valor]) => {
                acumulado += valor;
                return { data, valor: acumulado };
              });
          
            break;
          }

          case "comunidades": {
            const { data: uc, error } = await supabase
              .from("usuarios_comunidades")
              .select("data_ingresso")
              .in("usuario_id", usuariosIds);

            if (error) throw error;

            const agrupado = uc.reduce((acc: Record<string, number>, u) => {
              const data = u.data_ingresso?.slice(0, 10);
              if (data) acc[data] = (acc[data] || 0) + 1;
              return acc;
            }, {});

            let acumulado = 0;
            dados = Object.entries(agrupado)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([data, valor]) => {
                acumulado += valor;
                return { data, valor: acumulado };
              });
            break;
          }
        }

        setDadosTotais(dados);
        setDadosFiltrados(dados);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [empresaUrl, tipo]);

  useEffect(() => {
    if (filtroData === "customizado") {
      setDataInicio("");
      setDataFim("");
      setDadosFiltrados(dadosTotais);
      return;
    }

    let inicio = dataInicio;
    let fim = dataFim;

    if (filtroData === "semana") {
      inicio = formatDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      fim = formatDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    } else if (filtroData === "mes") {
      inicio = formatDate(startOfMonth(new Date()));
      fim = formatDate(endOfMonth(new Date()));
    } else if (filtroData === "ano") {
      inicio = formatDate(startOfYear(new Date()));
      fim = formatDate(endOfYear(new Date()));
    }

    if (!filtroData) {
      setDadosFiltrados(dadosTotais);
      return;
    }

    const filtrado = dadosTotais.filter(
      (item) => item.data >= inicio && item.data <= fim
    );
    setDadosFiltrados(filtrado);
    setDataInicio(inicio);
    setDataFim(fim);
  }, [filtroData]);

  useEffect(() => {
    if (filtroData !== "customizado") return;
    if (!dataInicio || !dataFim) return;
    if (new Date(dataInicio) > new Date(dataFim)) return;

    const filtrado = dadosTotais.filter(
      (item) => item.data >= dataInicio && item.data <= dataFim
    );
    setDadosFiltrados(filtrado);
  }, [dataInicio, dataFim, filtroData]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center w-full mb-4 pt-6">
        <div className="flex flex-wrap justify-center items-center md:gap-2 gap-1 sm:mb-4 mb-2">
          {["semana", "mes", "ano", "customizado"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroData(tipo)}
              className={`px-4 py-2 rounded-md border ${
                filtroData === tipo
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-200 text-black/60 border-gray-300"
              }`}
            >
              {tipo === "semana" && "Semana"}
              {tipo === "mes" && "Mês"}
              {tipo === "ano" && "Ano"}
              {tipo === "customizado" && "Customizado"}
            </button>
          ))}
  
          <button
            onClick={() => setFiltroData("")}
            className={`px-4 py-2 rounded-md border ${
              filtroData === ""
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-200 text-black/60 border-gray-300"
            }`}
          >
            Todos
          </button>
        </div>
  
        {filtroData === "customizado" && (
          <div className="flex justify-center items-center gap-2 w-full max-w-[600px] px-4">
            <label className="bg-gray-200 p-2 rounded-md text-black/50 sm:w-auto">
              <input
                type="date"
                value={dataInicio}
                onChange={(event) => setDataInicio(event.target.value)}
                className="w-30 sm:w-full focus:outline-none"
              />
            </label>
            <label className="bg-gray-200 p-2 rounded-md text-black/50 sm:w-auto">
              <input
                type="date"
                value={dataFim}
                onChange={(event) => setDataFim(event.target.value)}
                className="w-30 sm:w-full focus:outline-none"
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="flex justify-center items-center w-full flex-grow">
        <div className="flex justify-center items-center w-full h-full pb-6 sm:p-0 sm:h-[90%]">
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dadosFiltrados}
                margin={{ top: 5, right: 30, left: -30, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Grafico;
