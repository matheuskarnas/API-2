import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Header from "../components/Header";

interface Empresa {
  id: number;
  nome: string;
  descricao: string;
  url_exclusiva: string;
  url_logo_baixa_resolucao?: string;
}

export function Home() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const { data, error } = await supabase
          .from("patrocinadores")
          .select("id, nome, descricao, url_exclusiva, url_logo_baixa_resolucao")
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
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "200px" 
        }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#007BFF",
                  animation: `bounce 1s infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Nossos Patrocinadores
        </h1>
        
        {empresas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Nenhum patrocinador cadastrado
          </p>
        ) : (
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            {empresas.map((empresa) => (
              <div
                key={empresa.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "200px",
                  textAlign: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {empresa.url_logo_baixa_resolucao && (
                  <img 
                    src={empresa.url_logo_baixa_resolucao} 
                    alt={`Logo ${empresa.nome}`}
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      objectFit: "contain",
                      marginBottom: "15px"
                    }}
                  />
                )}
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
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