import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export interface MapsProps {}

const position = { lat: -23.162124, lng: -45.795476 }

const Maps = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDQcoUwW7kMqU8Hx4W3jGUh68AIPI3UbDc',
    });

    return (
        <section className="flex justify-center items-center h-88 max-sm:h-76 ">
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={{ width: '90%', height: '80%' }}
                    center={position}
                    zoom={15}
                >
                    <Marker position={position}/>
                </GoogleMap>
            ) : (
                <p>Carregando...</p>
            )}
        </section>
    );
};

export default Maps;
