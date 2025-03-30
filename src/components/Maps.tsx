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


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: patrocinador, error: patError } = await supabase
          .from("patrocinadores")
          .select("id")
          .eq("url_exclusiva", empresaUrl)
          .single();

        if (patError || !patrocinador) {
          throw new Error(patError?.message || "Patrocinador não encontrado");
        }

        const { data: patrocinadorUsuarios, error: puError } = await supabase
          .from("patrocinadores_usuarios")
          .select("usuario_id")
          .eq("patrocinador_id", patrocinador.id);

        if (puError) throw puError;
        if (!patrocinadorUsuarios || patrocinadorUsuarios.length === 0) {
          throw new Error("Nenhum usuário encontrado para este patrocinador");
        }

        const usuarioIds = patrocinadorUsuarios.map((pu) => pu.usuario_id);

        const { data: lojas, error: lojasError } = await supabase
          .from("lojas")
          .select("localizacao_id")
          .in("usuario_id", usuarioIds);

        if (lojasError) throw lojasError;

        const { data: usuariosComunidades, error: ucError } = await supabase
          .from("usuarios_comunidades")
          .select("comunidade_id, usuario_id")
          .in("usuario_id", usuarioIds);

        if (ucError) throw ucError;

        const locationsMap: Record<
          number,
          {
            coordenadas: Coordinates;
            lojasCount: number;
            comunidadesCount: number;
          }
        > = {};

        const localizacaoIds = new Set<number>();

        lojas?.forEach((loja) => {
          if (loja.localizacao_id) {
            localizacaoIds.add(loja.localizacao_id);
          }
        });

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

        const { data: localizacoes, error: locError } = await supabase
          .from("localizacoes")
          .select("id, coordenadas")
          .in("id", Array.from(localizacaoIds));

        if (locError) throw locError;

        localizacoes?.forEach((loc) => {
          locationsMap[loc.id] = {
            coordenadas: loc.coordenadas,
            lojasCount: 0,
            comunidadesCount: 0,
          };
        });

        lojas?.forEach((loja) => {
          if (loja.localizacao_id && locationsMap[loja.localizacao_id]) {
            locationsMap[loja.localizacao_id].lojasCount += 1;
          }
        });

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
              const userCount = usuariosComunidades.filter(
                (uc) => uc.comunidade_id === com.id
              ).length;
              locationsMap[com.localizacao_id].comunidadesCount += userCount;
            }
          });
        }

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
      <div className="w-full sm:w-[95%] md:w-[90%] xl:w-[80%] flex justify-center items-center h-57 max-sm:h-55 text-red-500 p-4">
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
    <div className="
  w-full xl:max-w-[75%] mx-auto rounded-lg shadow-lg relative
  h-[calc(100vh-550px)]
  xl:h-[calc(100vh-500px)]
">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'cooperative',
            styles: [
              {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
          onLoad={(map) => {
            mapRef.current = map;
            const bounds = new window.google.maps.LatLngBounds();
            locations.forEach(loc => bounds.extend(loc.coordenadas));
            map.fitBounds(bounds, 50);
          }}
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
                <p className="font-bold">Lojas: {selectedLocation.lojasCount}</p>
                <p className="font-bold">Comunidades: {selectedLocation.comunidadesCount}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maps;
