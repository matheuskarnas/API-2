import Header from "../components/Header";
import { Link } from "react-router-dom";

export function ErrorPage() {
  return (
    <>
      <Header />
      <main>
        <section className = 'flex flex-col itens-center h-screen p-16'>
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className ="font-extrabold text-9xl text-gray-700">
              <span className="sr-only">Error</span>404
            </h1>
            <p className="text-2xl md:text-3xl text-xl text-black">Empresa não encontrada!</p>
            <Link
                to={`/`}
                className="text-white bg-blue-500 md:px-13 px-1.5 py-4 text-xl rounded hover:bg-indigo-600 inline-block mt-2 no-underline"
              >
                Voltar para a página inicial
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}