import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";


const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export function Stats(){
  const [patrocinadorId] = useState<number>(1);
  const [totalLojas, setTotalLojas] = useState<number>(0);
  const [totalInteracoes, setTotalInteracoes] = useState<number>(0);
  const [totalComunidades, setTotalComunidades] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarDados();
  }, [patrocinadorId]);

  async function buscarDados() {
    try {
      setLoading(true);
      setError(null);

      const [lojasRes, amizadesRes, comunidadesRes] = await Promise.all([
        supabase.from("lojas").select("*", { count: "exact" }).eq("usuario_id", patrocinadorId),
        supabase.from("amizades").select("*", { count: "exact" }).eq("usuario_id", patrocinadorId),
        supabase.from("usuarios_comunidades").select("*", { count: "exact" }).eq("usuario_id", patrocinadorId),
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
    return(
        <div className="grid grid-cols-2 gap-4  w-full max-w">
        <div className="bg-gray-200 p-4 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-25 ">
          <p className="text-xs text-black">Número de lojas criadas</p>
          <p className="text-2xl text-black font-bold">{totalLojas}</p>
        </div>
        <div className="bg-gray-200 p-4 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-25  ">
          <p className="text-xs text-black">Famílias impactadas:</p>
          <p className="text-2xl text-black font-bold">{totalInteracoes}</p>
        </div>
        <div className="bg-gray-200 p-4 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-25">
          <p className="text-xs text-black">Cidades impactadas:</p>
          <p className="text-2xl text-black font-bold">5</p>
        </div>
        <div className="bg-gray-200 p-4 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-25">
          <p className="text-xs text-black">Comunidades impactadas:</p>
          <p className="text-2xl text-black font-bold">{totalComunidades}</p>
        </div>
      </div>
    )
}