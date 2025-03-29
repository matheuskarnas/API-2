import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export function Stats() {
  const { empresaUrl } = useParams();
  const [totalLojas, setTotalLojas] = useState<number>(0);
  const [familiasImpactadas, setFamiliasImpactadas] = useState<number>(0);
  const [totalComunidades, setTotalComunidades] = useState<number>(0);
  const [cidadesImpactadas, setCidadesImpactadas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: patrocinador, error: patrocinadorError } = await supabase
          .from("patrocinadores")
          .select("id")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (patrocinadorError || !patrocinador) {
          throw new Error("Patrocinador não encontrado");
        }

        const { data: usuariosPatrocinados, error: usuariosError } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id")
          .eq("patrocinador_id", patrocinador.id);

        if (usuariosError) throw usuariosError;
        const usuariosIds = usuariosPatrocinados?.map(u => u.usuario_id) || [];

        if (usuariosIds.length === 0) {
          setTotalLojas(0);
          setFamiliasImpactadas(0);
          setTotalComunidades(0);
          setCidadesImpactadas(0);
          return;
        }

        const { count: lojasCount } = await supabase
          .from("lojas")
          .select("*", { count: "exact", head: true })
          .in("usuario_id", usuariosIds);

        const { data: comunidadesUsuarios, error: comunidadesError } = await supabase
          .from("usuarios_comunidades")
          .select("comunidade_id")
          .in("usuario_id", usuariosIds);

        if (comunidadesError) throw comunidadesError;
        setTotalComunidades(comunidadesUsuarios?.length || 0);

        let totalPessoasComunidades = 0;
        const comunidadesUnicas = [...new Set(
          comunidadesUsuarios?.map(c => c.comunidade_id) || []
        )];

        for (const comunidadeId of comunidadesUnicas) {
          const { count: totalMembros } = await supabase
            .from("usuarios_comunidades")
            .select("*", { count: "exact", head: true })
            .eq("comunidade_id", comunidadeId);

          const { count: usuariosNestaComunidade } = await supabase
            .from("usuarios_comunidades")
            .select("*", { count: "exact", head: true })
            .eq("comunidade_id", comunidadeId)
            .in("usuario_id", usuariosIds);

          totalPessoasComunidades += (totalMembros || 0) * (usuariosNestaComunidade || 0);
        }

        const { count: totalAmizades } = await supabase
          .from("amizades")
          .select("*", { count: "exact", head: true })
          .in("usuario_id", usuariosIds);

        setFamiliasImpactadas(totalPessoasComunidades + (totalAmizades || 0));
        setTotalLojas(lojasCount || 0);

        const { data: lojasData } = await supabase
          .from("lojas")
          .select("localizacao_id")
          .in("usuario_id", usuariosIds);

        const { data: comunidadesData } = await supabase
          .from("comunidades")
          .select("localizacao_id")
          .in("id", comunidadesUnicas);

        const localizacoesLojas = lojasData?.map(l => l.localizacao_id) || [];
        const localizacoesComunidades = comunidadesData?.map(c => c.localizacao_id) || [];
        
        const localizacoesUnicas = [...new Set([
          ...localizacoesLojas,
          ...localizacoesComunidades
        ])];

        setCidadesImpactadas(localizacoesUnicas.length);

      } catch (err) {
        setError((err as Error).message);
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [empresaUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-auto p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-300 w-1/3 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-300 w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Lojas criadas</p>
        <p className="text-2xl font-bold text-black">{totalLojas}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Famílias impactadas</p>
        <p className="text-2xl font-bold text-black">{familiasImpactadas}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Cidades impactadas</p>
        <p className="text-2xl font-bold text-black">{cidadesImpactadas}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Comunidades</p>
        <p className="text-2xl font-bold text-black">{totalComunidades}</p>
      </div>
    </div>
  );
}