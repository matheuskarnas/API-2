import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function Stats() {
  const { empresaId } = useParams();
  const [patrocinadorId] = useState<number>(Number(empresaId));
  const [totalLojas, setTotalLojas] = useState<number>(99);
  const [totalInteracoes, setTotalInteracoes] = useState<number>(99);
  const [totalComunidades, setTotalComunidades] = useState<number>(99);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarDados();
  }, [patrocinadorId]);

  async function buscarDados() {
    try {
      setLoading(true);
      setError(null);

      const [lojasRes, amizadesRes, comunidadesRes] = await Promise.all([
        supabase
          .from("lojas")
          .select("*", { count: "exact" })
          .eq("usuario_id", patrocinadorId),
        supabase
          .from("amizades")
          .select("*", { count: "exact" })
          .eq("usuario_id", patrocinadorId),
        supabase
          .from("usuarios_comunidades")
          .select("*", { count: "exact" })
          .eq("usuario_id", patrocinadorId),
      ]);

      if (lojasRes.error) throw lojasRes.error;
      if (amizadesRes.error) throw amizadesRes.error;
      if (comunidadesRes.error) throw comunidadesRes.error;

      setTotalLojas(lojasRes.data.length);
      setTotalComunidades(comunidadesRes.data.length);
      setTotalInteracoes(amizadesRes.data.length + comunidadesRes.data.length);
    } catch (err) {
      setError((err as Error).message);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
    console.log(loading, error);
  }

  if (loading) {
    return (
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2  w-full max-w">
      <div className="bg-gray-200 p-2.5 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-17 ">
        <p className="text-xs text-black text-center">Número de lojas criadas</p>
        <p className="text-2xl text-black font-bold text-center">{totalLojas}</p>
      </div>
      <div className="bg-gray-200 p-2.5 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-17  ">
        <p className="text-xs text-black text-center">Famílias impactadas:</p>
        <p className="text-2xl text-black font-bold text-center">{totalInteracoes}</p>
      </div>
      <div className="bg-gray-200 p-2.5 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-17">
        <p className="text-xs text-black text-center">Cidades impactadas:</p>
        <p className="text-2xl text-black font-bold text-center">5</p>
      </div>
      <div className="bg-gray-200 p-2.5 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-17">
        <p className="text-xs text-black text-center">Comunidades impactadas:</p>
        <p className="text-2xl text-black font-bold text-center">{totalComunidades}</p>
      </div>
    </div>
  );
}
