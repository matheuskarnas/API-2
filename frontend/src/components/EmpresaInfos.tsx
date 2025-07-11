import { useState, useEffect } from "react";

interface Empresa {
  url_logo: string;
  descricao: string;
  nome: string;
}

interface EmpresaInfosProps {
  empresa: Empresa;
}

export function EmpresaInfos({ empresa }: EmpresaInfosProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (empresa) {
      setLoading(false);
      setError(null);
      return;
    }
    setError("Empresa não encontrada");
  }, [empresa]);

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
      <div className="xl:hidden">
        <div className="relative">
          <div className="flex justify-center min-[500px]:block min-[500px]:float-left min-[500px]:mr-6 mb-4 min-[500px]:mb-0">
            {empresa?.url_logo ? (
              <img
                src={empresa.url_logo}
                alt={`Logo da ${empresa.nome}`}
                className="w-[150px] min-[500px]:w-40 md:w-48 lg:w-56 object-contain rounded-md"
              />
            ) : (
              <div className="w-[150px] h-[150px] min-[500px]:w-40 min-[500px]:h-40 md:w-48 md:h-48 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Sem logo</span>
              </div>
            )}
          </div>
  
          <p className="text-black text-base sm:text-[20px] md:text-xl [hyphens:auto]">
            {empresa?.descricao}
          </p>
          <div className="clear-both"></div>
        </div>
      </div>
  
      <div className="hidden xl:block">
        <div className="flex justify-center">
          <div className="flex items-center gap-8 max-w-6xl">
            <div className="flex-shrink-0 w-64">
              {empresa?.url_logo ? (
                <img
                  src={empresa.url_logo}
                  alt={`Logo da ${empresa.nome}`}
                  className="object-contain rounded-md"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-black">Sem logo</span>
                </div>
              )}
            </div>
  
            <p className="text-black text-xl [hyphens:auto] max-w-[600px]">
              {empresa?.descricao}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
