import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationData {
  coordenadas: Coordinates;
  lojasCount: number;
  comunidadesCount: number;
  localizacaoId: number;
}

const Maps = () => {
  const { empresaUrl } = useParams();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar o patrocinador pela URL
        const { data: patrocinador, error: patError } = await supabase
          .from("patrocinadores")
          .select("id")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (patError || !patrocinador) {
          throw new Error(patError?.message || "Patrocinador não encontrado");
        }

        // 2. Buscar usuários associados ao patrocinador via tabela intermediária
        const { data: patrocinadorUsuarios, error: puError } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id")
          .eq("patrocinador_id", patrocinador.id);

        if (puError) throw puError;
        if (!patrocinadorUsuarios || patrocinadorUsuarios.length === 0) {
          throw new Error("Nenhum usuário encontrado para este patrocinador");
        }

        const usuarioIds = patrocinadorUsuarios.map((pu) => pu.usuario_id);

        // 3. Buscar lojas dos usuários
        const { data: lojas, error: lojasError } = await supabase
          .from("lojas")
          .select("localizacao_id")
          .in("usuario_id", usuarioIds);

        if (lojasError) throw lojasError;

        // 4. Buscar comunidades dos usuários (via tabela intermediária)
        const { data: usuariosComunidades, error: ucError } = await supabase
          .from("usuarios_comunidades")
          .select("comunidade_id, usuario_id")
          .in("usuario_id", usuarioIds);

        if (ucError) throw ucError;

        // Objeto para agrupar dados por localização
        const locationsMap: Record<
          number,
          {
            coordenadas: Coordinates;
            lojasCount: number;
            comunidadesCount: number;
          }
        > = {};

        // 5. Buscar todas as localizações relevantes
        const localizacaoIds = new Set<number>();

        // Adicionar localizações das lojas
        lojas?.forEach((loja) => {
          if (loja.localizacao_id) {
            localizacaoIds.add(loja.localizacao_id);
          }
        });

        // Buscar comunidades para obter suas localizações
        if (usuariosComunidades && usuariosComunidades.length > 0) {
          const comunidadeIds = [
            ...new Set(usuariosComunidades.map((uc) => uc.comunidade_id)),
          ];

          const { data: comunidades, error: comError } = await supabase
            .from("comunidades")
            .select("id, localizacao_id")
            .in("id", comunidadeIds);

          if (comError) throw comError;

          comunidades?.forEach((com) => {
            if (com.localizacao_id) {
              localizacaoIds.add(com.localizacao_id);
            }
          });
        }

        // Buscar coordenadas das localizações
        const { data: localizacoes, error: locError } = await supabase
          .from("localizacoes")
          .select("id, coordenadas")
          .in("id", Array.from(localizacaoIds));

        if (locError) throw locError;

        // Inicializar o mapa de localizações
        localizacoes?.forEach((loc) => {
          locationsMap[loc.id] = {
            coordenadas: loc.coordenadas,
            lojasCount: 0,
            comunidadesCount: 0,
          };
        });

        // Contar lojas por localização
        lojas?.forEach((loja) => {
          if (loja.localizacao_id && locationsMap[loja.localizacao_id]) {
            locationsMap[loja.localizacao_id].lojasCount += 1;
          }
        });

        // Contar comunidades por localização (considerando usuários repetidos)
        if (usuariosComunidades && usuariosComunidades.length > 0) {
          const comunidadeIds = usuariosComunidades.map(
            (uc) => uc.comunidade_id
          );

          const { data: comunidades, error: comError } = await supabase
            .from("comunidades")
            .select("id, localizacao_id")
            .in("id", comunidadeIds);

          if (comError) throw comError;

          comunidades?.forEach((com) => {
            if (com.localizacao_id && locationsMap[com.localizacao_id]) {
              // Contar quantos usuários estão nesta comunidade
              const userCount = usuariosComunidades.filter(
                (uc) => uc.comunidade_id === com.id
              ).length;
              locationsMap[com.localizacao_id].comunidadesCount += userCount;
            }
          });
        }

        // Converter para array
        const locationsData = Object.entries(locationsMap).map(
          ([id, data]) => ({
            ...data,
            localizacaoId: Number(id),
          })
        );

        setLocations(locationsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [empresaUrl]);

  useEffect(() => {
    if (isLoaded && mapRef.current && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((loc) => bounds.extend(loc.coordenadas));
      mapRef.current.fitBounds(bounds);
    }
  }, [isLoaded, locations]);

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="h-8 bg-gray-300 w-100% animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-57 max-sm:h-55 text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-57 max-sm:h-55 p-4">
        <p>Nenhuma localização encontrada para este patrocinador.</p>
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center h-57 max-sm:h-55">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "89%", height: "75%" }}
          onLoad={(map) => {
            mapRef.current = map;
            const bounds = new window.google.maps.LatLngBounds();
            locations.forEach((loc) => bounds.extend(loc.coordenadas));
            map.fitBounds(bounds);
          }}
          options={mapOptions}
        >
          {locations.map((loc, index) => (
            <Marker
              key={index}
              position={loc.coordenadas}
              onClick={() => setSelectedLocation(loc)}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.coordenadas}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2 text-gray-500">
                <h3 className="font-bold">Localização</h3>
                <p>Lojas: {selectedLocation.lojasCount}</p>
                <p>Comunidades: {selectedLocation.comunidadesCount}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <p>Carregando mapa...</p>
      )}
    </section>
  );
};

export default Maps;
