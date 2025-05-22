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

        const { data: usuariosPatrocinados, error: errUsuarios } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id")
          .eq("patrocinador_id", patrocinador.id);

        if (errUsuarios) throw errUsuarios;

        const usuariosIds = usuariosPatrocinados?.map((u) => u.usuario_id) || [];

        if (usuariosIds.length === 0) {
          setDadosOriginais([]);
          setDadosFiltrados([]);
          return;
        }

        const dados = Object.entries(value)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([data, valor]) => ({ data, valor }));

        setDadosOriginais(dados);
        setDadosFiltrados(acumularDados(dados));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();
  }, [empresaUrl]);

  const acumularDados = (dados: { data: string; valor: number }[]) => {
    return dados.reduce((acc, { data, valor }, index) => {
      const acumulado = index === 0 ? valor : valor + acc[index - 1].valor;
      acc.push({ data, valor: acumulado });
      return acc;
    }, [] as { data: string; valor: number }[]);
  };

  const acumularDadosFiltrados = (dados: { data: string; valor: number }[]) => {
    return dados.reduce((acc, { data, valor }, index) => {
      const acumulado = index === 0 ? valor : valor + acc[index - 1].valor;
      acc.push({ data, valor: acumulado });
      return acc;
    }, [] as { data: string; valor: number }[]);
  };

  useEffect(() => {
    if (!dadosOriginais.length) return;

    let inicio = dataInicio;
    let fim = dataFim;

    if (filtroData === "semana") {
      inicio = formatDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      fim = formatDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    } else if (filtroData === "mes") {
      inicio = formatDate(startOfMonth(new Date()));
      fim = formatDate(endOfMonth(new Date()));
    } else if (filtroData === "ano") {
      inicio = formatDate(startOfYear(new Date()));
      fim = formatDate(endOfYear(new Date()));
    }

    if (filtroData === "customizado") {
      if (!dataInicio || !dataFim) {
        setDadosFiltrados(acumularDados(dadosOriginais));
        return;
      }
    } else if (!filtroData) {
      setDadosFiltrados(acumularDados(dadosOriginais));
      return;
    }

    const filtrado = dadosOriginais.filter(
      (item) => item.data >= inicio && item.data <= fim
    );

    const dadosAcumuladosFiltrados = acumularDadosFiltrados(filtrado);
    
    setDadosFiltrados(dadosAcumuladosFiltrados);
    setDataInicio(inicio);
    setDataFim(fim);
  }, [filtroData, dataInicio, dataFim, dadosOriginais]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center w-full mb-4 pt-6">
        <div className="flex flex-wrap justify-center items-center md:gap-2 gap-1 sm:mb-4 mb-2">
          {["semana", "mes", "ano", "customizado"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroData(tipo)}
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
            onClick={() => setFiltroData("")}
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
                className="w-30 sm:w-full focus:outline-none"
              />
            </label>
            <label className="bg-gray-200 p-2 rounded-md text-black/50 sm:w-auto">
              <input
                type="date"
                value={dataFim}
                onChange={(event) => setDataFim(event.target.value)}
                className="w-30 sm:w-full focus:outline-none"
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