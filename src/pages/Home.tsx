import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Header from "../components/Header";

interface Empresa {
  id: number;
  nome: string;
  descricao: string;
  url_exclusiva: string;
  url_logo?: string;
}

export function Home() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const empresasFiltradas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const { data, error } = await supabase
          .from("patrocinadores")
          .select("id, nome, descricao, url_exclusiva, url_logo")
          .order("nome", { ascending: true });

        if (error) throw error;
        if (data) setEmpresas(data);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="p-5 font-sans">
          <h1 className="text-2xl font-bold mb-5 text-center">Nossos Patrocinadores</h1>
          <div className="flex flex-wrap gap-5 justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-lg p-5 w-52 text-center shadow-sm flex flex-col items-center bg-white"
              >
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
      <Header />
      <main className="px-5 md:px-[10%]  font-sans">
        <h1 style={{ 
          fontSize: "24px", 
          fontFamily: "inter" , 
          marginBottom: "20px",
          textAlign: "center",
          color: "black"
        }}>
          Empresas que estão fazendo a diferença!
        </h1>
        <div className="flex justify-center mb-5  W-full  ">
          <input
            type="text"
            placeholder="Pesquisar Patrocinador"
            className="p-2 border-none rounded-lg w-[200px] sm:w-[250px] md:w-[350px] h-[42px] md bg-gray-200 text-black text-base shadow-md pl-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {empresas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#000" }}>
            Nenhum patrocinador cadastrado
          </p>
        ) : (
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {empresasFiltradas.map((empresa) => (
              <div
                key={empresa.id}
                className="border border-gray-300 rounded-lg p-5 w-[200px] text-center shadow-md flex flex-col items-center"
              >
                {empresa.url_logo && (
                  <img 
                    src={empresa.url_logo} 
                    alt={`Logo ${empresa.nome}`}
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      objectFit: "contain",
                      marginBottom: "15px"
                    }}
                  />
                )}
                <h3 style={{ fontSize: "18px", marginBottom: "10px", color: '#000' }}>
                  {empresa.nome}
                </h3>
                <Link
                  to={`/empresa/${empresa.url_exclusiva}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#007BFF",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    marginTop: "auto",
                    width: "100%"
                  }}
                >
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}