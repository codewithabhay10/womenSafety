import { useState, useEffect } from 'react';
import { useLocation } from '../../context/LocationContext';
import ForumPost from './ForumPost';
import Spinner from '../common/Spinner';
import { getNearbyReviews } from '../../services/forum';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const NearbyReviews = ({ maxDistance = 5000 }) => {
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLocation } = useLocation();
  const { user } = useAuth();
  const [distance, setDistance] = useState(maxDistance);
  
  useEffect(() => {
    const fetchNearbyReviews = async () => {
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        setError('Location not available. Please enable location services.');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const reviews = await getNearbyReviews(
          currentLocation.lat,
          currentLocation.lng,
          distance
        );
        
        setNearbyPosts(reviews);
      } catch (err) {
        console.error('Failed to fetch nearby reviews:', err);
        setError('Failed to load nearby reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNearbyReviews();
  }, [currentLocation, distance]);
  
  const handleDistanceChange = (e) => {
    setDistance(Number(e.target.value));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
        {error}
      </div>
    );
  }
  
  if (!currentLocation) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-4">
        Waiting for your location... Please make sure location services are enabled.
      </div>
    );
  }

return (
    <div>
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Distance: {(distance / 1000).toFixed(1)} km
          </label>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={distance}
            onChange={handleDistanceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Map display */}
        <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-4">
          <MapContainer 
            center={[currentLocation.lat, currentLocation.lng]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User's location */}
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>Your current location</Popup>
            </Marker>
            
            {/* Range circle */}
            <Circle 
              center={[currentLocation.lat, currentLocation.lng]}
              radius={distance}
              pathOptions={{ 
                color: 'blue', 
                fillColor: 'blue', 
                fillOpacity: 0.1 
              }}
            />
            
            {/* Review locations */}
            {nearbyPosts.map(post => (
              <Marker 
                key={post._id}
                position={[
                  post.location?.coordinates[1], 
                  post.location?.coordinates[0]
                ]}
                icon={L.divIcon({
                  className: `marker-icon ${
                    post.rating === 5 ? 'bg-green-500' :
                    post.rating >= 3 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`,
                  html: `<div class="w-4 h-4 rounded-full ${
                    post.rating === 5 ? 'bg-green-500' :
                    post.rating >= 3 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }"></div>`,
                  iconSize: [10, 10]
                })}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{post.routeName}</strong>
                    <p className="text-xs text-gray-500">
                      Safety rating: {post.rating}/5
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      
      {nearbyPosts.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No safety reviews found within {(distance/1000).toFixed(1)} km of your location.
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">
            {nearbyPosts.length} {nearbyPosts.length === 1 ? 'review' : 'reviews'} found nearby
          </h3>
          {nearbyPosts.map(post => (
            <ForumPost
              key={post._id}
              post={post}
              currentUserId={user?.userId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyReviews;