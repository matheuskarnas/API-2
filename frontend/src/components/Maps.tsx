import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  coordenadas: Coordinates;
  lojasCount: number;
  comunidadesCount: number;
  localizacaoId: number;
}

const mapStyle = [
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
];

interface MapsProps {
  locations: LocationData[];
  loading: boolean;
}

const Maps = ({ locations, loading }: MapsProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY,
    language: "pt-BR",
  });

  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location);
    
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: location.coordenadas }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
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
  };

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <div className="h-8 bg-gray-300 w-100% animate-pulse"></div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="
        w-[90%] xl:max-w-[75%] mx-auto rounded-lg shadow-lg relative
        h-[150px]
        md:h-[200px] w:[100%]
      ">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: -23.55052, lng: -46.633308 }}
            zoom={4}
            options={{
              styles: mapStyle
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            </div>
          </div>
        )}
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
            styles: mapStyle,          
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
              onClick={() => handleMarkerClick(loc)}
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