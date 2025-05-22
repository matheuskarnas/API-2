import { useState, useEffect } from "react";
import { Card } from "./Card";

interface StatsProps {
  usuarios: Record<string, number>;
  lojas: Record<string, number>;
  comunidades: Record<string, number>;
  cidades: Record<string, number>;
  familiasImpactadas: Record<string, number>;
  loading: boolean;
}

export function Stats({ lojas, comunidades, cidades, familiasImpactadas, loading }: StatsProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setError(null);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-auto p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg shadow">
            <div className="h-4 bg-gray-300 w-1/3 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-300 w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="
      grid grid-cols-2
      gap-[15px] sm:gap-y-[26px] sm:gap-x-[23px]
      w-full 
      max-w-[90%] 
      xl:max-w-[75%]
      mx-auto
      text-gray-600
    ">
      <Card srcImg="/assets/shop.png" title='Lojas Criadas' value={ lojas } />
      <Card srcImg="/assets/users-alt.png" title="Famílias impactadas" value={ familiasImpactadas } />
      <Card srcImg="/assets/map-marker.png" title="Cidades impactadas" value={ cidades } />
      <Card srcImg="/assets/building.png" title="Comunidades" value={ comunidades } />
    </div>
  )
}
