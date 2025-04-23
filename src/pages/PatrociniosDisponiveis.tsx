import { useState } from "react";
import Header from "../components/Header";
import { Link, useLocation } from "react-router-dom";

interface Empresa {
  id: number;
  nome: string;
  descricao: string;
  url_exclusiva: string;
  url_logo_baixa_resolucao?: string;
}

export function PatrociniosDisponiveis() {
  const location = useLocation();
  console.log ('dados recebidos em PatrociniosDisponiveis:', location.state)
  const [empresas] = useState<Empresa[]>(location.state ? location.state : []);

  return (
    <>
      <Header />
      <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
          Empresas Compatíveis
        </h1>

        {empresas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Nenhuma empresa compatível encontrada.
          </p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
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