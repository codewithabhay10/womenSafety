import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const IsochroneDisplay = ({ isochrone }) => {
  const map = useMap();
  const [isoLayer, setIsoLayer] = useState(null);
  
  useEffect(() => {
    // Clean up any existing layers
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
      
      // Fit the map to the isochrone area
      map.fitBounds(layer.getBounds());
      
      // Add a label to show the time
      const center = layer.getBounds().getCenter();
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: 'isochrone-label',
          html: `<div class="bg-white px-2 py-1 rounded shadow text-sm">10 min walking</div>`,
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
  }, [map, isochrone]);
  
  return null;
};

export default IsochroneDisplay;