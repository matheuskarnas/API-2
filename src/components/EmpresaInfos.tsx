import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Empresa {
  url_logo_baixa_resolucao: string;
  descricao: string;
  nome: string;
}

export function EmpresaInfos() {
  const { empresaUrl } = useParams();
  const [empresa, setEmpresa] = useState<Empresa>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEmpresa = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("patrocinadores")
          .select("*")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Empresa não encontrada");

        setEmpresa(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getEmpresa();
  }, [empresaUrl]);

  if (loading) {
    return (
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full xl:w-[80%] mx-auto bg-white rounded-lg flex flex-col xl:flex-row items-center text-center xl:text-left p-8 gap-8">
      {empresa?.url_logo_baixa_resolucao ? (
        <img
          src={empresa.url_logo_baixa_resolucao}
          alt={`Logo da ${empresa.nome}`}
          className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-md object-contain"
        />
      ) : (
        <div className="w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Sem logo</span>
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">{empresa?.nome}</h2>
        <p className="text-gray-600">{empresa?.descricao}</p>
      </div>
    </div>
  );
}