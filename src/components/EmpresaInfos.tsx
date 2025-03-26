import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
interface Empresa {
  descricao: string;
  nome: string;
}

export function EmpresaInfos() {
  const [empresa, setEmpresa] = useState<Empresa>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmpresa();
  }, []);

  async function getEmpresa() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("patrocinadores")
        .select<"*">();
      if (error) throw error;
      if (!data[0]) throw error;
      
      setEmpresa(data[0]);
    } catch (err) {
      setError((err as Error).message);
      console.error("Erro ao buscar instrumentos:", err);
    } finally {
      setLoading(false);
    }
  }
  console.log(loading, error);
  return (
    <div className="w-full xl:w-[70%] mx-auto bg-white rounded-lg  flex flex-col xl:flex-row items-center text-center xl:text-left p-4">
      <img
        src={`/assets/shipLogo.png`}
        alt="Loggi Logo"
        className="w-40 h-40 sm:w-60 sm:h-60 md:w-70 md:h-70 rounded-md"
      />
       { empresa ? (
        <>
          <p className="xl:mt-0 xl:ml-8 text-gray-700">{empresa.descricao}</p>
        </>
      ) : (
        <p className="text-gray-500">Nenhuma empresa encontrada.</p>
      )}
    </div> 
  );
}