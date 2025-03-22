import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../../context/LocationContext';
import { getRoute, getIsochrone } from '../../services/map';
import SearchLocation from './SearchLocation';
import RouteDisplay from './RouteDisplay';
import L from 'leaflet';

// Fix Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
};

// Component to display isochrone areas
const IsochroneDisplay = ({ isochrone, timeLabel }) => {
  const map = useMap();
  const [isoLayer, setIsoLayer] = useState(null);
  
  useEffect(() => {
    if (isoLayer) {
      if (isoLayer.layer) map.removeLayer(isoLayer.layer);
      if (isoLayer.marker) map.removeLayer(isoLayer.marker);
    }
    
    if (!isochrone || !isochrone.polygons) {
      return;
    }
    
    try {
      // Create a GeoJSON layer from the isochrone polygons
      const layer = L.geoJSON(isochrone.polygons, {
        style: {
          color: '#3388ff',
          weight: 2,
          opacity: 0.6,
          fillColor: '#3388ff',
          fillOpacity: 0.2
        }
      }).addTo(map);
      
      // Fit bounds to the isochrone
      map.fitBounds(layer.getBounds());
      
      // Add a label to show the time
      const center = layer.getBounds().getCenter();
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: 'isochrone-label',
          html: `<div class="bg-white px-2 py-1 rounded shadow text-sm">${timeLabel} walking</div>`,
          iconSize: [100, 40],
          iconAnchor: [50, 20]
        })
      }).addTo(map);
      
      // Save references for cleanup
      setIsoLayer({ layer, marker });
    } catch (error) {
      console.error('Error displaying isochrone:', error);
    }
    
    return () => {
      if (isoLayer) {
        if (isoLayer.layer) map.removeLayer(isoLayer.layer);
        if (isoLayer.marker) map.removeLayer(isoLayer.marker);
      }
    };
  }, [map, isochrone, timeLabel]);
  
  return null;
};

// Transportation profiles with icons and labels
const transportationProfiles = [
  { id: 'foot', label: 'Walking', icon: '🚶‍♀️' },
  { id: 'bike', label: 'Cycling', icon: '🚲' },
  { id: 'car', label: 'Driving', icon: '🚗' },
];

const SafetyMap = () => {
  const { currentLocation, loading } = useLocation();
  const [destination, setDestination] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [isochroneData, setIsochroneData] = useState(null);
  const [mapHeight, setMapHeight] = useState("500px");
  const [viewMode, setViewMode] = useState("route"); // 'route' or 'isochrone'
  const [routeLoading, setRouteLoading] = useState(false);
  const [transportProfile, setTransportProfile] = useState('foot'); // Default to walking
  
  // New state for isochrone time
  const [isochroneTime, setIsochroneTime] = useState(600); // Default 10 minutes in seconds
  const [isochroneTimeLabel, setIsochroneTimeLabel] = useState('10 min'); // Human-readable label
  
  // Handle map resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Mobile
        setMapHeight("400px");
      } else if (window.innerWidth < 1024) { // Tablet
        setMapHeight("500px");
      } else { // Desktop
        setMapHeight("600px");
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle search result
  const handleSearch = (location) => {
    setDestination(location);
  };
  
  // Handle map click
  const handleMapClick = useCallback((latlng) => {
    // When user clicks on the map, set as destination
    setDestination({
      lat: latlng.lat,
      lng: latlng.lng,
      address: "Selected Location"
    });
  }, []);
  
  // Handle profile change
  const handleProfileChange = (profileId) => {
    setTransportProfile(profileId);
    // Re-fetch route if we have a destination and current location
    if (destination && currentLocation && viewMode === 'route') {
      fetchRoute(currentLocation, destination, profileId);
    } else if (currentLocation && viewMode === 'isochrone') {
      fetchIsochrone(currentLocation, profileId);
    }
  };
  
  // Fetch route with the given profile
  const fetchRoute = async (start, end, profile) => {
    setRouteLoading(true);
    
    try {
      const routeResult = await getRoute(
        start.lat,
        start.lng,
        end.lat,
        end.lng,
        profile
      );
      
      console.log("Route data received:", routeResult);
      setRouteData(routeResult);
      setIsochroneData(null);
    } catch (error) {
      console.error('Failed to fetch route data:', error);
    } finally {
      setRouteLoading(false);
    }
  };
  
    // Update the handleTimeChange function to handle validation

    // Handle isochrone time change
    const handleTimeChange = (minutes) => {
      // Validate input - ensure minutes is between 1 and 60
      const validMinutes = Math.min(Math.max(1, minutes), 60);
      const seconds = validMinutes * 60;
      
      setIsochroneTime(seconds);
      setIsochroneTimeLabel(`${validMinutes} min`);
      
      // If we have currentLocation, refetch with new time
      if (currentLocation && viewMode === 'isochrone') {
        fetchIsochrone(currentLocation, transportProfile);
      }
    };
  
  // Fetch isochrone with the given profile
  const fetchIsochrone = async (location, profile) => {
    setRouteLoading(true);
    
    try {
      const isochroneResult = await getIsochrone(
        location.lat,
        location.lng,
        isochroneTime, // Use the state variable instead of hardcoded 600
        profile
      );
      
      console.log("Isochrone data received:", isochroneResult);
      setIsochroneData(isochroneResult);
      setRouteData(null);
    } catch (error) {
      console.error('Failed to fetch isochrone data:', error);
    } finally {
      setRouteLoading(false);
    }
  };
  
  // Fetch data when destination or transport profile changes
  useEffect(() => {
    if (!currentLocation || !destination) return;
    
    if (viewMode === 'route') {
      fetchRoute(currentLocation, destination, transportProfile);
    } else {
      fetchIsochrone(currentLocation, transportProfile);
    }
  }, [destination, currentLocation, viewMode, transportProfile]);
  
  // Toggle between route and isochrone modes
  const toggleViewMode = () => {
    const newMode = viewMode === 'route' ? 'isochrone' : 'route';
    setViewMode(newMode);
    
    // Update data based on new mode
    if (newMode === 'isochrone' && currentLocation) {
      fetchIsochrone(currentLocation, transportProfile);
    } else if (newMode === 'route' && currentLocation && destination) {
      fetchRoute(currentLocation, destination, transportProfile);
    }
  };
  
  // Get current profile information
  const currentProfile = transportationProfiles.find(p => p.id === transportProfile) || transportationProfiles[0];
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading map...</div>;
  }
  
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Search container - moved outside of map for visibility */}
      <div className="p-4 bg-white border-b border-gray-200" style={{ position: 'relative', zIndex: 999 }}>
        <SearchLocation onSearch={handleSearch} />
        
        {/* Transportation mode selector */}
        <div className="mt-3 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap gap-1 mb-2">
            {transportationProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => handleProfileChange(profile.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center ${
                  transportProfile === profile.id 
                    ? 'bg-primary-100 text-primary-700 border-primary-300 border' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                }`}
              >
                <span className="mr-1">{profile.icon}</span>
                <span>{profile.label}</span>
              </button>
            ))}
          </div>

          {/* Enhanced time selector - only show when in isochrone mode */}
          {viewMode === 'isochrone' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2 px-3 py-2 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Travel Time:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Preset options */}
                <div className="flex space-x-1">
                  {[5, 10, 15, 30].map(minutes => (
                    <button
                      key={minutes}
                      onClick={() => handleTimeChange(minutes)}
                      className={`px-2 py-1 text-xs rounded ${
                        isochroneTime === minutes * 60 
                          ? 'bg-primary-100 text-primary-700 border-primary-300 border' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
                
                {/* Custom input */}
                <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={isochroneTime / 60}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value > 0 && value <= 60) {
                        handleTimeChange(value);
                      }
                    }}
                    className="w-14 h-8 px-2 text-center border-none focus:outline-none"
                  />
                  <span className="pr-2 text-sm text-gray-500">min</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleViewMode}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            {viewMode === 'route' ? '📍 Show Reachable Areas' : '🔄 Show Route'}
          </button>
        </div>
      </div>
      
      {/* Map container with relative positioning */}
      <div className="relative">
        {/* Route loading indicator */}
        {routeLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              <span>Calculating {viewMode === 'route' ? currentProfile.label + ' route' : 'reachable areas'}...</span>
            </div>
          </div>
        )}
        
        <MapContainer 
          center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [40.7128, -74.0060]} 
          zoom={13} 
          style={{ height: mapHeight, width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Click handler */}
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Current location marker */}
          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>Your current location</Popup>
            </Marker>
          )}
          
          {/* Destination marker */}
          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>{destination.address || "Destination"}</Popup>
            </Marker>
          )}
          
          {/* Route display */}
          {routeData && viewMode === 'route' && <RouteDisplay route={routeData} />}
          
          {/* Isochrone display with time label */}
          {isochroneData && viewMode === 'isochrone' && 
            <IsochroneDisplay isochrone={isochroneData} timeLabel={isochroneTimeLabel} />
          }
        </MapContainer>
      </div>

      {/* Route information card with directions - NOW BELOW THE MAP, NOT ABSOLUTE */}
      {routeData && viewMode === 'route' && !routeLoading && (
        <div className="bg-white rounded-lg shadow-sm p-4 m-4 border-t border-gray-200">
          <h3 className="font-medium text-lg flex items-center">
            <span className="mr-2">{currentProfile.icon}</span>
            Recommended {currentProfile.label} Route
          </h3>
          
          {/* Summary stats */}
          <div className="flex items-center text-green-600 mt-2">
            <span className="mr-2">•</span>
            <span>
              {routeData.paths && routeData.paths[0]?.distance 
                ? `${(routeData.paths[0].distance / 1000).toFixed(2)} km • ${Math.round((routeData.paths[0].time || routeData.paths[0].duration) / 1000 / 60)} min`
                : "Route information not available"}
            </span>
          </div>

          {/* Route directions */}
          {routeData.paths && routeData.paths[0]?.instructions && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <details open className="text-sm">
                <summary className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer mb-2">
                  👉 Turn-by-turn directions (click to toggle)
                </summary>
                
                <div className="mt-2 text-gray-700 max-h-60 overflow-y-auto pr-2 border-l-2 border-blue-200 pl-2">
                  <ol className="space-y-2 list-decimal list-outside pl-5">
                    {routeData.paths[0].instructions.map((instruction, index) => (
                      <li key={index}>
                        <div className="font-medium">{instruction.text}</div>
                        {instruction.distance > 0 && (
                          <div className="text-xs text-gray-500">
                            {(instruction.distance / 1000).toFixed(2)} km • {Math.round(instruction.time / 1000 / 60)} min
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            </div>
          )}
          
          {/* Safety notes */}
          <div className="mt-2 text-sm text-gray-600">
            <span className="mr-2">
              <span className="text-green-600 font-medium">Safer route</span> • Well lit • 24/7 cameras
            </span>
          </div>
        </div>
      )}
            
      {/* Isochrone information card - ALSO BELOW THE MAP */}
      {isochroneData && viewMode === 'isochrone' && !routeLoading && (
        <div className="bg-white rounded-lg shadow-sm p-4 m-4 border-t border-gray-200">
          <h3 className="font-medium text-lg flex items-center">
            <span className="mr-2">{currentProfile.icon}</span>
            Reachable in {isochroneTimeLabel}
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            <p>This area shows where you can reach within a {isochroneTimeLabel} {currentProfile.label.toLowerCase()} journey</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyMap;