import { useState } from "react";

interface Plano {
  id: number;
  titulo: string;
  preco: string;
  beneficios: string[];
  cor: string;
  priceId: string;
}

export function EmpresaPlanos() {
  const [planos] = useState<Plano[]>([
    {
      id: 1,
      titulo: "Bronze",
      preco: "R$75",
      beneficios: [
        "15 lojas patrocinadas.",
        "Site exclusivo com os dados do impacto do seu patrocínio.",
      ],
      cor: "bg-yellow-700",
      priceId: "price_1RRdaZGgNYbQYKnfStMtYJVi",
    },
    {
      id: 2,
      titulo: "Prata",
      preco: "R$120",
      beneficios: [
        "25 lojas patrocinadas.",
        "Site exclusivo com os dados do impacto do seu patrocínio.",
      ],
      cor: "bg-gray-400",
      priceId: "price_1RRdarGgNYbQYKnftS4BYbkm",
    },
    {
      id: 3,
      titulo: "Ouro",
      preco: "R$230",
      beneficios: [
        "50 lojas patrocinadas.",
        "Site exclusivo com os dados do impacto do seu patrocínio.",
      ],
      cor: "bg-yellow-400",
      priceId: "price_1RRdbCGgNYbQYKnfuFec1xY3",
    },
  ]);

  return (
    <>
      <main className="px-5 md:px-[10%] font-sans min-h-screen bg-blue-900 flex flex-col items-center py-12">
        <h1 className="text-white text-2xl font-bold mb-12 text-center">
          Escolha o Plano Ideal
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
              <div className="text-3xl font-bold text-blue-600 my-4">{plano.preco}</div>
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
                  const response = await fetch('http://localhost:4242/create-empresa-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceId: plano.priceId }),
                  });
                  const data = await response.json();
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
