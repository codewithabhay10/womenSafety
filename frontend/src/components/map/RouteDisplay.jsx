import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { decodePolyline } from '../../utils/polylineDecoder';

const RouteDisplay = ({ route }) => {
  const map = useMap();
  const [routeLayer, setRouteLayer] = useState(null);
  
  useEffect(() => {
    // Debugging the route data
    console.log("Processing route data:", route);
    
    // Clean up any existing layers
    if (routeLayer) {
      if (Array.isArray(routeLayer)) {
        routeLayer.forEach(layer => map.removeLayer(layer));
      } else {
        map.removeLayer(routeLayer);
      }
    }
    
    // Check if route data exists
    if (!route || !route.paths || route.paths.length === 0) {
      console.warn('No valid route data available');
      return;
    }
    
    try {
      const layers = [];
      const path = route.paths[0];
      
      // Extract points from GraphHopper format
      let points = [];
      
      // Handle encoded polyline points (which is what GraphHopper typically returns)
      if (path.points_encoded && path.points) {
        console.log("Decoding encoded polyline...");
        points = decodePolyline(path.points);
        console.log("Decoded points:", points);
      } 
      // Try to extract from geometry format (alternative format)
      else if (path.geometry) {
        if (typeof path.geometry === 'string') {
          points = decodePolyline(path.geometry);
        } else if (path.geometry.coordinates) {
          points = path.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        }
      }
      // Try points.coordinates format (another possibility)
      else if (path.points && path.points.coordinates) {
        points = path.points.coordinates.map(coord => [coord[1], coord[0]]);
      }
      // Try points as array (non-encoded format)
      else if (path.points && Array.isArray(path.points)) {
        const pointPairs = [];
        for (let i = 0; i < path.points.length; i += 2) {
          if (i + 1 < path.points.length) {
            pointPairs.push([path.points[i], path.points[i + 1]]);
          }
        }
        points = pointPairs;
      }
      
      // Log format if no points were found
      if (points.length === 0) {
        console.error('Could not extract route points. Path format:', path);
        return;
      }
      
      console.log(`Found ${points.length} points to display`);
      
      if (points.length > 0) {
        // Create the polyline
        const polyline = L.polyline(points, {
          color: '#0066ff',
          weight: 5,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        
        layers.push(polyline);
        
        // Fit the map to the route bounds
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        
        // Add sample safety points for demonstration
        if (points.length > 4) {
          const midPoint = Math.floor(points.length / 2);
          const quarterPoint = Math.floor(points.length / 4);
          const threeQuarterPoint = Math.floor(points.length * 3 / 4);
          
          // Add safety markers
          const safePoint = L.circleMarker(points[quarterPoint], {
            radius: 8,
            color: 'white',
            weight: 2,
            fillColor: '#10B981', // Green for safe
            fillOpacity: 0.8
          }).bindPopup("Safe area - Well lit with regular patrols").addTo(map);
          
          const cautionPoint = L.circleMarker(points[midPoint], {
            radius: 8,
            color: 'white',
            weight: 2,
            fillColor: '#F59E0B', // Yellow for caution
            fillOpacity: 0.8
          }).bindPopup("Use caution - Less populated at night").addTo(map);
          
          const dangerPoint = L.circleMarker(points[threeQuarterPoint], {
            radius: 8,
            color: 'white',
            weight: 2,
            fillColor: '#EF4444', // Red for danger
            fillOpacity: 0.8
          }).bindPopup("Exercise extra caution - Poor lighting").addTo(map);
          
          layers.push(safePoint, cautionPoint, dangerPoint);
        }
        
        setRouteLayer(layers);
      }
    } catch (error) {
      console.error('Error displaying route:', error);
    }
    
    return () => {
      if (routeLayer) {
        if (Array.isArray(routeLayer)) {
          routeLayer.forEach(layer => map.removeLayer(layer));
        } else {
          map.removeLayer(routeLayer);
        }
      }
    };
  }, [map, route]);
  
  return null;
};

export default RouteDisplay;