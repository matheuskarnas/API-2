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
    <div className="w-full bg-white rounded-lg px-4 mx-auto">
      {/* Layout para telas menores (mobile/tablet) */}
      <div className="xl:hidden">
        <div className="relative">
          {/* Imagem - Centralizada apenas em mobile */}
          <div className="flex justify-center min-[500px]:block min-[500px]:float-left min-[500px]:mr-6 mb-4 min-[500px]:mb-0">
            {empresa?.url_logo_baixa_resolucao ? (
              <img
                src={empresa.url_logo_baixa_resolucao}
                alt={`Logo da ${empresa.nome}`}
                className="w-[150px] min-[500px]:w-40 md:w-48 lg:w-56 object-contain rounded-md"
              />
            ) : (
              <div className="w-[150px] h-[150px] min-[500px]:w-40 min-[500px]:h-40 md:w-48 md:h-48 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Sem logo</span>
              </div>
            )}
          </div>
  
          {/* Texto - Comportamento original */}
          <p className="text-gray-600 text-base sm:text-lg md:text-xl [hyphens:auto]">
            {empresa?.descricao}
          </p>
          <div className="clear-both"></div>
        </div>
      </div>
  
      {/* Layout específico para XL (1280px+) - Versão corrigida */}
      <div className="hidden xl:block">
        <div className="flex justify-center">
          <div className="flex items-center gap-8 max-w-6xl">
            {/* Imagem XL */}
            <div className="flex-shrink-0 w-64">
              {empresa?.url_logo_baixa_resolucao ? (
                <img
                  src={empresa.url_logo_baixa_resolucao}
                  alt={`Logo da ${empresa.nome}`}
                  className="object-contain rounded-md"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Sem logo</span>
                </div>
              )}
            </div>
  
            {/* Texto XL */}
            <p className="text-gray-600 text-xl [hyphens:auto] max-w-[600px]">
              {empresa?.descricao}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
