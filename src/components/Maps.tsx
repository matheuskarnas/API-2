import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useEffect, useRef } from 'react';

const positions = [
    { lat: -23.162124, lng: -45.795476 },
    { lat: -23.163500, lng: -45.798000 },
    { lat: -23.160800, lng: -45.793200 },
    { lat: -23.165000, lng: -45.799500 },
    { lat: -23.161500, lng: -45.796800 }
];

const Maps = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDQcoUwW7kMqU8Hx4W3jGUh68AIPI3UbDc',
    });

    const mapRef = useRef<google.maps.Map | null>(null);

    const mapOptions = {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    };

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            positions.forEach(pos => bounds.extend(pos));
            mapRef.current.fitBounds(bounds);
        }
    }, [isLoaded]);

    return (
        <section className="flex justify-center items-center h-88 max-sm:h-76">
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={{ width: '90%', height: '80%' }}
                    onLoad={(map) => { 
                        mapRef.current = map; 
                        const bounds = new window.google.maps.LatLngBounds();
                        positions.forEach(pos => bounds.extend(pos));
                        map.fitBounds(bounds);
                    }}
                    options={mapOptions}
                >
                    {positions.map((pos, index) => (
                        <Marker key={index} position={pos} />
                    ))}
                </GoogleMap>
            ) : (
                <p>Carregando mapa...</p>
            )}
        </section>
    );
};

export default Maps;
