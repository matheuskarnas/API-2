import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Header from "../components/Header";

interface Empresa {
  id: number;
  nome: string;
  url_exclusiva: string;
  url_logo?: string;
}

const empresas_por_page = 15;
const max_paginas_view = 3;

export function Home() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("patrocinadores")
          .select("id, nome, url_exclusiva, url_logo")
          .order("nome", { ascending: true });

        if (error) throw error;

        if (data) {
          setEmpresas(data);
          setTotalPages(Math.ceil(data.length / empresas_por_page));
        }
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const empresasFiltradas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1); 
    setTotalPages(Math.ceil(empresasFiltradas.length / empresas_por_page));
  }, [searchTerm, empresas]);

  const startIndex = (currentPage - 1) * empresas_por_page;
  const endIndex = startIndex + empresas_por_page;
  const empresasPaginadas = empresasFiltradas.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const showEllipsis = totalPages > max_paginas_view + 2;

    let startPage = 1;
    let endPage = totalPages;

    if (showEllipsis) {
      startPage = Math.max(1, currentPage - Math.floor(max_paginas_view / 2));
      endPage = Math.min(totalPages, currentPage + Math.floor(max_paginas_view / 2));

      if (endPage - startPage + 1 < max_paginas_view) {
        if (currentPage <= Math.ceil(max_paginas_view / 2)) {
          endPage = Math.min(totalPages, max_paginas_view);
        } else {
          startPage = Math.max(1, totalPages - max_paginas_view + 1);
        }
      }
    }

    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => goToPage(1)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start" className="px-1 mx-1 text-gray-700">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end" className="px-1 mx-1 text-gray-700">...</span>);
      }
      buttons.push(
        <button key={totalPages} onClick={() => goToPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <>
        <Header empresa={null} loading={false} />
        <main className="p-5 font-sans">
          <h1 className="text-2xl font-bold mb-5 text-center">Nossos Patrocinadores</h1>
          <div className="flex flex-wrap gap-5 justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="border border-gray-300 rounded-lg p-5 w-52 text-center shadow-sm flex flex-col items-center bg-white">
                <div className="w-20 h-20 bg-gray-200 mb-4 rounded-lg animate-pulse" />
                <div className="w-3/5 h-5 bg-gray-200 mb-3 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 mt-auto rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header empresa={null} loading={loading} />
      <main className="px-5 md:px-[10%] font-sans">
        <h1 className="text-2xl mt-10 text-center text-black font-bold">
          Empresas que estão fazendo a diferença!
        </h1>

        <div className="flex justify-center items-center flex-wrap gap-4 mt-6 mb-8">
          <Link to="">
          </Link>
        </div>

        <div className="flex justify-center mt-8 w-full">
          <input
            type="text"
            placeholder="Pesquisar Patrocinador"
            className="p-2 border-none rounded-lg w-[200px] sm:w-[250px] md:w-[350px] h-[42px] bg-gray-200 text-black text-base shadow-md pl-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={searchInputRef}
          />
        </div>

        {empresasFiltradas.length === 0 ? (
          <p className="text-center text-black mt-6">
            Nenhum patrocinador encontrado com este termo de busca.
          </p>
        ) : (
          <>
           <div className="mt-8 flex gap-5 flex-wrap justify-center
                            max-w-6xl mx-auto">
               {empresasPaginadas.map((empresa) => (
                 <div key={empresa.id}
                  className="border border-gray-300 rounded-lg p-5 w-[200px] text-center shadow-md flex flex-col items-center">
                  {empresa.url_logo && (
                    <img
                      src={empresa.url_logo}
                      alt={`Logo ${empresa.nome}`}
                      className="w-20 h-20 object-contain mb-4"
                    />
                  )}
                  <h3 className="text-lg mb-2 text-black font-semibold">{empresa.nome}</h3>
                  <Link
                    to={`/empresa/${empresa.url_exclusiva}`}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-auto w-full text-center"
                  >
                    Ver detalhes
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 mb-5">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Anterior
                </button>
                {getPaginationButtons()}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 ml-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
