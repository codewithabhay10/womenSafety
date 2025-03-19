import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';
import { getRoute } from '../../services/map';
import SearchLocation from './SearchLocation';
import RouteDisplay from './RouteDisplay';

const SafetyMap = () => {
  const { currentLocation, loading } = useLocation();
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [safetyMarkers, setMarkers] = useState([]);

  useEffect(() => {
    // Fetch safety markers from API
    // This would be replaced with actual API call
    setMarkers([
      {
        id: 1,
        position: [40.7812, -73.9665],
        type: 'safe',
        description: 'Well-lit area with regular security patrols'
      },
      {
        id: 2,
        position: [40.7580, -73.9855],
        type: 'caution',
        description: 'Poor lighting after dark'
      }
    ]);
  }, []);

  const handleSearch = (location) => {
    setDestination(location);
  };

  const fetchRoute = async () => {
    if (!currentLocation || !destination) return;
    
    try {
      const routeData = await getRoute(
        currentLocation.lat,
        currentLocation.lng,
        destination.lat,
        destination.lng
      );
      setRoute(routeData);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchRoute();
    }
  }, [destination, currentLocation]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading map...</div>;
  }

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <div className="absolute top-4 left-4 right-4 z-10">
        <SearchLocation onSearch={handleSearch} />
      </div>
      
      <MapContainer 
        center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [40.7128, -74.0060]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        
        {safetyMarkers.map(marker => (
          <Marker 
            key={marker.id} 
            position={marker.position}
          >
            <Popup>{marker.description}</Popup>
          </Marker>
        ))}
        
        {route && <RouteDisplay route={route} />}
      </MapContainer>
      
      {route && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-medium text-lg">Recommended Safe Route</h3>
          <div className="flex items-center text-green-600 mt-2">
            <span className="mr-2">•</span>
            <span>5th Avenue → Madison Avenue → 32nd Street</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="mr-2">Safer route • Well lit • 24/7 cameras • 12 min walk</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyMap;
