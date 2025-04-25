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
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLocation) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: selectedLocation.coordenadas }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          console.log(results);
          setEstado(
            results[0]?.address_components?.find(component =>
              component.types.includes("administrative_area_level_1")
            )?.short_name || null
          );
          const cidade = results
            .flatMap(result => result.address_components)
            .find(component => component.types.includes("locality"))?.long_name || null;

          setCidade(cidade);
        }
      });
    }
  }, [selectedLocation as LocationData | null]);

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
  w-[90%] xl:max-w-[75%] mx-auto rounded-lg shadow-lg relative
  h-[150px]
  md:h-[200px] w:[100%]
">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            disableDefaultUI: true,
            gestureHandling: 'cooperative',
            styles:
              // {
              //   stylers: [{ visibility: "off" }]
              // }
              
              [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "elementType": "labels.icon",
                  "stylers": [
                    {
                      "visibility": "off"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#616161"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#f5f5f5"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#bdbdbd"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ffffff"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#757575"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dadada"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#616161"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e5e5e5"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#eeeeee"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#c9c9c9"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#9e9e9e"
                    }
                  ]
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
                scaledSize: new window.google.maps.Size(24, 24),
              }}
            />
          ))}
          {selectedLocation && (
            <InfoWindow
            position={selectedLocation.coordenadas}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="text-center p-4 rounded-lg min-w-[200px]">
                <button
                  aria-label="Fechar"
                  className="absolute top-0 right-0 w-8 h-8 bg-gray-400 text-black rounded flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedLocation(null)}
                >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
                </svg>
              </button>
              <h3 className="text-center text-2xl font-[Helvetica] font-bold text-blue-900 mb-2">{cidade} - {estado}
              </h3>
              <div className="space-y-2">
                <p className="flex items-center gap-5 text-blue-600">
                  <svg className="w-6 h-6 " fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a4 4 0 00-4 4v1h8V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v1H8V6z"/>
                    <path d="M2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                  </svg>
                  <span className="font-[Helvetica] font-bold text-black text-base">{selectedLocation.lojasCount} Lojas</span>
                </p>
                <p className="flex items-center gap-5 text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                  <span className="font-[Helvetica] font-bold text-black text-base">{selectedLocation.comunidadesCount} Comunidades</span>
                </p>
              </div>
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
