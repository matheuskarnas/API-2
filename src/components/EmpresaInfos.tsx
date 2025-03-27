import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
interface Empresa {
  descricao: string;
  nome: string;
}

export function EmpresaInfos() {
  const { empresaId } = useParams();
  const [patrocinadorId] = useState<number>(Number(empresaId));
  const [empresa, setEmpresa] = useState<Empresa>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmpresa();
  }, [patrocinadorId]);

  async function getEmpresa() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("patrocinadores")
        .select<"*">();
      if (error) throw error;
      if (!data[patrocinadorId - 1]) throw error;

      setEmpresa(data[patrocinadorId - 1]);
    } catch (err) {
      setError((err as Error).message);
      console.error("Erro ao buscar instrumentos:", err);
    } finally {
      setLoading(false);
    }
  }
  console.log(loading, error);

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
    <div className="w-full xl:w-[80%] mx-auto bg-white rounded-lg  flex flex-col xl:flex-row items-center text-center xl:text-left">
      <img
        src={`/assets/shipLogo.png`}
        alt="Loggi Logo"
        className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-md"
      />
      {empresa ? (
        <>
          <p className="xl:mt-0 xl:ml-8 text-gray-700 text-xl">{empresa.descricao}</p>
        </>
      ) : (
        <p className="text-gray-500">Nenhuma empresa encontrada.</p>
      )}
    </div>
  );
}
