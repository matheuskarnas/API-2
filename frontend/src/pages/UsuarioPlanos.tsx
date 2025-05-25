import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

interface Plano {
  id: number;
  titulo: string;
  preco: string;
  beneficios: string[];
  cor: string;
  priceid: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

export function UsuarioPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const url = window.location.origin;

  useEffect(() => {
    const pegarPlanos = async () => {
      try {
        const { data, error } = await supabase
          .from("planos_usuario")
          .select("*");

        if (error || !data) throw new Error("Planos não encontrados");
        setPlanos(data);
      } catch (err) {
        console.error("Falha ao pegar informações dos planos:", err);
      }
    };

    pegarPlanos();
  }, []);

  return (
    <>
      <main className="px-5 md:px-[10%] font-sans min-h-screen bg-blue-900 flex flex-col items-center py-12">
        <div className="hidden">
          bg-yellow-400 bg-yellow-700 bg-gray-400
        </div>
        <h1 className="text-white text-2xl font-bold mb-12 text-center">
          Escolha o Plano Ideal para Você
        </h1>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md w-[280px] flex flex-col items-center bg-white"
            >
              <div className={`${plano.cor} w-full text-center py-4 text-white font-bold text-xl`}>
                {plano.titulo}
              </div>
              <div className="text-3xl font-bold text-blue-600 my-4">R${Number(plano.preco).toFixed(2)}</div>
              <ul className="px-6 flex-1 mb-4">
                {plano.beneficios.map((beneficio, index) => (
                  <li key={index} className="mb-2 text-gray-700 text-sm text-center">
                    {beneficio}
                  </li>
                ))}
              </ul>
              <button
                style={{
                  marginBottom: "20px",
                  padding: "10px 20px",
                  border: "1px solid #007BFF",
                  color: "#007BFF",
                  borderRadius: "8px",
                  background: "transparent",
                  transition: "0.3s",
                  width: "80%",
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "#007BFF";
                  (e.target as HTMLButtonElement).style.color = "white";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.target as HTMLButtonElement).style.color = "#007BFF";
                }}
                onClick={async () => {
                  const response = await fetch(`${BASE_URL}/create-usuario-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceId: plano.priceid, url: url }),
                  });
                  const data = await response.json();
                  localStorage.setItem('priceId', plano.priceid);
                  window.location.href = data.url;
                }}
              >
                Assinar
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
