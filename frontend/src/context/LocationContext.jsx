import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          // Fallback to a default location (New York City)
          setCurrentLocation({
            lat: 40.7128,
            lng: -74.0060
          });
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by this browser');
      // Fallback to a default location
      setCurrentLocation({
        lat: 40.7128,
        lng: -74.0060
      });
      setLoading(false);
    }
  }, []);

  const value = {
    currentLocation,
    loading,
    error
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export default LocationContext;
