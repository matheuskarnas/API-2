import Header from "../components/Header";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <>
      <Header />
      <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <section style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                width: "200px",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>Empresa {index + 1}</h3>
              <p>Descrição breve da Empresa {index + 1}.</p>
              <Link
                to={`/empresa/${index + 1}`}
                style={{
                  textDecoration: "none",
                  color: "white",
                  backgroundColor: "#007BFF",
                  padding: "10px 15px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                Ver mais
              </Link>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
