import { useEffect, useState } from "react";
import { CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const Grafico = () => { 
  const [dataInicio, setDataInicio] = useState ('');
  const [dataFim, setDataFim] = useState ('');
  const [dadosFiltrados, setDadosFiltrados] = useState<{ data: string; valor: number }[]>([]);
  const [filtroData, setFiltroData] = useState('');

  {/*Dados de exemplo, trocar pela conexão com o banco de dados*/}
  {/*Possivel necessidade de modificar outro componente como o modal ou o Stats para funcionar com banco,
    estou vendo exatamente como funciona primeiro*/}
  const dadosTotais = [
    { data: '2025-04-14', valor: 10 },
    { data: '2025-04-15', valor: 13 },
    { data: '2025-04-16', valor: 17 },
    { data: '2025-04-17', valor: 22 },
    { data: '2025-04-18', valor: 28 },
    { data: '2025-04-19', valor: 34 },
    { data: '2025-04-20', valor: 38 },
    { data: '2025-04-21', valor: 44 },
    { data: '2025-04-22', valor: 49 },
    { data: '2025-04-23', valor: 53 },
    { data: '2025-04-24', valor: 59 },
    { data: '2025-04-25', valor: 66 },
    { data: '2025-04-26', valor: 72 },
    { data: '2025-04-27', valor: 77 },
  ];

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  useEffect(() => {
    if (filtroData === 'customizado') {
      setDataInicio('');
      setDataFim('');
      setDadosFiltrados(dadosTotais);
    } else {

    let inicio = dataInicio;
    let fim = dataFim;

    if (filtroData === 'semana') {
      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const end = endOfWeek(new Date(), { weekStartsOn: 1 });
      inicio = formatDate(start);
      fim = formatDate(end);
    } else if (filtroData === 'mes') {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      inicio = formatDate(start);
      fim = formatDate(end);
    } else if (filtroData === 'ano') {
      const start = startOfYear(new Date());
      const end = endOfYear(new Date());
      inicio = formatDate(start);
      fim = formatDate(end);
    }

    if (filtroData === '') {
      setDadosFiltrados(dadosTotais)
      return;
    }

    const dadosFiltrados = dadosTotais.filter(
      (item) => item.data >= inicio && item.data <= fim
    );
    setDadosFiltrados(dadosFiltrados);
    setDataInicio(inicio);
    setDataFim(fim);
    }
  }, [filtroData]);

  useEffect(() => {
    if (filtroData !== "customizado") return;
    if (!dataInicio || !dataFim) return;
    if (new Date(dataInicio) > new Date(dataFim)) return;

    const dadosCustomizados = dadosTotais.filter(
      (item) => item.data >= dataInicio && item.data <= dataFim
    );

    setDadosFiltrados(dadosCustomizados);
    
  }, [dataInicio, dataFim, filtroData]);

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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFiltrados}
            margin={{ top: 5, right: 30, left: -30, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='data' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='valor' stroke='#8884d8' activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Grafico;