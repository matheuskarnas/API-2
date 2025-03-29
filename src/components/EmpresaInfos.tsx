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
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="h-4 bg-gray-300 w-1/3 mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-300 w-1/2 animate-pulse"></div>
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
