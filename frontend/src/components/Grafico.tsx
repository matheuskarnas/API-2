import { useEffect, useState } from "react";
import {CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line} from "recharts";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} from "date-fns";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface GraficoProps {
  value: Record<string, number>;
}

const Grafico = ({ value }: GraficoProps) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dadosOriginais, setDadosOriginais] = useState<{ data: string; valor: number }[]>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState<{ data: string; valor: number }[]>([]);
  const [filtroData, setFiltroData] = useState('');
  const { empresaUrl } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: patrocinador, error: errPat } = await supabase
          .from("patrocinadores")
          .select("id")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (errPat || !patrocinador) throw new Error("Patrocinador não encontrado");

        const dados = Object.entries(value)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([data, valor]) => ({ data, valor }));

        if (dados.length === 0) {
            setDadosOriginais([]);
            setDadosFiltrados([]);
            return;
        }

        setDadosOriginais(dados);
        setDadosFiltrados(acumularDados(dados));
      } catch (err) {
        setError((err as Error).message);
        setDadosOriginais([]);
        setDadosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [empresaUrl, value]);

  const acumularDados = (dados: { data: string; valor: number }[]) => {
    if (!dados || dados.length === 0) return [];
    return dados.reduce((acc, { data, valor }, index) => {
      const acumulado = index === 0 ? valor : valor + acc[index - 1].valor;
      acc.push({ data, valor: acumulado });
      return acc;
    }, [] as { data: string; valor: number }[]);
  };

  useEffect(() => {
    if (!dadosOriginais.length && !filtroData) {
        setDadosFiltrados([]);
        return;
    }

    let inicioCalculado = dataInicio;
    let fimCalculado = dataFim;
    let aplicarFiltroGeral = true;

    if (filtroData === "semana") {
      inicioCalculado = formatDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      fimCalculado = formatDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    } else if (filtroData === "mes") {
      inicioCalculado = formatDate(startOfMonth(new Date()));
      fimCalculado = formatDate(endOfMonth(new Date()));
    } else if (filtroData === "ano") {
      inicioCalculado = formatDate(startOfYear(new Date()));
      fimCalculado = formatDate(endOfYear(new Date()));
    } else if (filtroData === "customizado") {
      if (!dataInicio || !dataFim) {
        setDadosFiltrados(acumularDados(dadosOriginais));
        return;
      }
      
      inicioCalculado = dataInicio;
      fimCalculado = dataFim;
    } else {
      setDadosFiltrados(acumularDados(dadosOriginais));
      aplicarFiltroGeral = false;
    }

    if(aplicarFiltroGeral) {
        const filtrado = dadosOriginais.filter(
            (item) => item.data >= inicioCalculado && item.data <= fimCalculado
        );
        setDadosFiltrados(acumularDados(filtrado));
    }

    if (filtroData && filtroData !== "customizado" && filtroData !== "") {
        setDataInicio(inicioCalculado);
        setDataFim(fimCalculado);
    }

  }, [filtroData, dataInicio, dataFim, dadosOriginais]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center w-full mb-4 pt-6">
        <div className="flex flex-wrap justify-center items-center md:gap-2 gap-1 sm:mb-4 mb-2">
          {["semana", "mes", "ano", "customizado"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => {
                setFiltroData(tipo);
                if (tipo !== "customizado") {
                }
              }}
              className={`px-4 py-2 rounded-md border ${
                filtroData === tipo
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-200 text-black/60 border-gray-300"
              }`}
            >
              {tipo === "semana" && "Semana"}
              {tipo === "mes" && "Mês"}
              {tipo === "ano" && "Ano"}
              {tipo === "customizado" && "Customizado"}
            </button>
          ))}
    
          <button
            onClick={() => {
                setFiltroData("");
            }}
            className={`px-4 py-2 rounded-md border ${
              filtroData === ""
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-200 text-black/60 border-gray-300"
            }`}
          >
            Todos
          </button>
        </div>
    
        {filtroData === "customizado" && (
          <div className="flex justify-center items-center gap-2 w-full max-w-[600px] px-4">
            <label className="bg-gray-200 p-2 rounded-md text-black/50 sm:w-auto">
              <input
                type="date"
                value={dataInicio}
                onChange={(event) => setDataInicio(event.target.value)}
                className="w-30 sm:w-full focus:outline-none bg-transparent"
              />
            </label>
            <label className="bg-gray-200 p-2 rounded-md text-black/50 sm:w-auto">
              <input
                type="date"
                value={dataFim}
                onChange={(event) => setDataFim(event.target.value)}
                className="w-30 sm:w-full focus:outline-none bg-transparent"
              />
            </label>
          </div>
        )}
      </div>
      
      <div className="flex justify-center items-center w-full flex-grow">
        <div className="flex justify-center items-center w-full h-full pb-6 sm:p-0 sm:h-[90%]">
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : dadosFiltrados.length === 0 ? (
            <p>Nenhum dado chegou nesse período</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dadosFiltrados}
                margin={{ top: 5, right: 30, left: -30, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Valor Acumulado"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grafico;