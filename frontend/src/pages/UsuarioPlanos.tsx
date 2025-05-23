import { useState } from "react";

interface Plano {
  id: number;
  titulo: string;
  preco: string;
  beneficios: string[];
  cor: string;
  priceId: string;


}

export function UsuarioPlanos() {
  const [planos] = useState<Plano[]>([
    {
      id: 1,
      titulo: "Iniciante",
      preco: "R$0,00",
      beneficios: [
        "1 loja",
        "30 produtos por loja marca personalizada",
        "Meio de pagamento integrado*",
        "Compartilhe produtos com 1 clique",
        "Crie sua comunidade de clientes",
      ],
      cor: "bg-yellow-700",
    priceId: "price_1RRdZDGgNYbQYKnfstMCa5Wt",
    },
    {
      id: 2,
      titulo: "Prata",
      preco: "R$14,97",
      beneficios: [
        "3 lojas",
        "30 produtos por loja marca personalizada",
        "Meio de pagamento integrado*",
        "Compartilhe produtos com 1 clique",
        "Crie sua comunidade de clientes",
      ],
      cor: "bg-gray-400",
      priceId: "price_1RRdZmGgNYbQYKnfPQcHFB4L",

    },
    {
      id: 3,
      titulo: "Ouro",
      preco: "R$19,97",
      beneficios: [
        "10 lojas de afiliado ou marca própria",
        "Produtos ilimitados",
        "Compartilhe produtos com 1 clique",
        "Crie sua comunidade de clientes",
        "Notificações automáticas para seus clientes",
        "Suporte para se tornar afiliado de marcas",
        "Suporte via WhatsApp para dúvidas",
      ],
      cor: "bg-yellow-400",
      priceId: "price_1RRdaBGgNYbQYKnfrGoFhBAw",
    },
  ]);

  return (
    <>
      <main className="px-5 md:px-[10%] font-sans min-h-screen bg-blue-900 flex flex-col items-center py-12">
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
                  const response = await fetch('https://api-2-backend.app/create-usuario-checkout-session', {
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
