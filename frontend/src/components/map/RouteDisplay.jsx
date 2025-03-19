import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const RouteDisplay = ({ route }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!route || !route.paths || route.paths.length === 0) return;
    
    // Clear existing route layers
    map.eachLayer(layer => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    
    // Get the route coordinates
    const path = route.paths[0];
    const points = path.points.coordinates.map(coord => [coord[1], coord[0]]);
    
    // Create a polyline for the route
    const routeLine = L.polyline(points, {
      color: '#0066ff',
      weight: 5,
      opacity: 0.7
    }).addTo(map);
    
    // Fit the map to the route bounds
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    
    return () => {
      map.removeLayer(routeLine);
    };
  }, [map, route]);
  
  return null; // This component doesn't render anything directly
};

export default RouteDisplay;
