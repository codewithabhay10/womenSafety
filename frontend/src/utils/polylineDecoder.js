/**
 * Decodes an encoded polyline string to coordinates
 * Based on Google's polyline encoding algorithm
 */
export function decodePolyline(encoded) {
    if (!encoded || encoded.length === 0) {
      return [];
    }
    
    // For the default GraphHopper factor
    const factor = 1e5;
    
    const poly = [];
    let index = 0;
    let lat = 0;
    let lng = 0;
    
    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      
      shift = 0;
      result = 0;
      
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      
      // GraphHopper returns [latitude, longitude]
      poly.push([lat / factor, lng / factor]);
    }
    
    return poly;
  }