import { useEffect, useState } from "react";
import { CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts";

const Grafico = () => {
  const [dataInicio, setDataInicio] = useState ('');
  const [dataFim, setDataFim] = useState ('');
  const [dadosFiltrados, setDadosFiltrados] = useState<{ data: string; valor: number }[]>([]);

  {/*Dados de exemplo, trocar pela conexão com o banco de dados*/}
  {/*Possivel necessidade de modificar outro componente como o modal ou o Stats para funcionar com banco,
    estou vendo exatamente como funciona primeiro*/}
  const dadosTotais = [
    { data: '2025-04-01', valor: 10 },
    { data: '2025-04-02', valor: 13 },
    { data: '2025-04-03', valor: 17 },
    { data: '2025-04-04', valor: 22 },
    { data: '2025-04-05', valor: 28 },
    { data: '2025-04-06', valor: 34 },
    { data: '2025-04-07', valor: 38 },
    { data: '2025-04-08', valor: 44 },
    { data: '2025-04-09', valor: 49 },
    { data: '2025-04-10', valor: 53 },
    { data: '2025-04-11', valor: 59 },
    { data: '2025-04-12', valor: 66 },
    { data: '2025-04-13', valor: 72 },
    { data: '2025-04-14', valor: 77 },
    { data: '2025-04-15', valor: 85 },
  ];

  useEffect(() => {
    if (dataInicio && dataFim) {
        const dadosFiltrados = dadosTotais.filter((item) => {
            return item.data >= dataInicio && item.data <= dataFim;
        });
        setDadosFiltrados(dadosFiltrados); 
    } else {
      setDadosFiltrados(dadosTotais);
    }
  }, [dataInicio, dataFim]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4 w-full max-w-md">
        <label className="w-full bg-gray-100 p-2 rounded-md shadow-sm">
          <input 
            type="date"
            value={dataInicio}
            onChange={(event) => setDataInicio(event.target.value)}
            className="bg-transparent text-gray-700 font-medium outline-none appearance-none w-full"
          />
        </label>
        <label className="w-full bg-gray-100 p-2 rounded-md shadow-sm">
          <input 
            type="date"
            value={dataFim}
            onChange={(event) => setDataFim(event.target.value)}
            className="bg-transparent text-gray-700 font-medium outline-none appearance-none w-full"
          />
        </label>
      </div>  

      <div className="flex justify-center items-center w-full h-[375px] sm:h-[90%]">
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
  )
}

export default Grafico;