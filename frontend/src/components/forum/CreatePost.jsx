import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { createReview } from '../../services/forum';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

// Map marker component that handles clicks
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  return position ? <Marker position={position} /> : null;
};

// Star Rating component
const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            type="button"
            key={ratingValue}
            className={`text-2xl ${
              ratingValue <= (hover || rating) 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

const CreatePost = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [safetyLevel, setSafetyLevel] = useState('safe');
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rating, setRating] = useState(5); // Default rating
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  
  // Set initial map center to user's current location or a default
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC default
  
  useEffect(() => {
    if (currentLocation && currentLocation.lat && currentLocation.lng) {
      setMapCenter([currentLocation.lat, currentLocation.lng]);
    }
  }, [currentLocation]);
  
  // Reverse geocoding to get address from coordinates
  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Extract a shorter readable name from the address
        const parts = data.display_name.split(',').slice(0, 3);
        return parts.join(', ');
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown location';
    }
  };
  
  // Handle map marker placement
  const handleLocationSelect = async (latlng) => {
    setSelectedLocation({
      lat: latlng.lat,
      lng: latlng.lng
    });
    
    // Get location name from coordinates
    const name = await getLocationName(latlng.lat, latlng.lng);
    setLocationName(name);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all required fields
    if (!user || !user.userId) {
      setError('You must be logged in to post a review');
      return;
    }
    
    if (!selectedLocation) {
      setError('Please select a location on the map');
      return;
    }
    
    if (!content) {
      setError('Please enter some content for your review');
      return;
    }
    
    if (!locationName) {
      setError('Please enter a location name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newReview = {
        userId: user.userId,
        routeName: locationName,
        content,
        rating, // Using the user-selected rating
        safetyLevel,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        }
      };
      
      console.log('Sending review data:', newReview);
      
      const response = await createReview(newReview);
      
      if (onPostCreated) {
        onPostCreated(response);
      }
      
      setIsOpen(false);
      setContent('');
      setLocationName('');
      setSafetyLevel('safe');
      setRating(5); // Reset rating to default
      setSelectedLocation(null);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError(error.response?.data?.msg || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Share Information
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Share Safety Information"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Location on Map
            </label>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-2">
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker 
                  position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null}
                  setPosition={handleLocationSelect}
                />
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Click on the map to select a location
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location Name
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter or edit location name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Safety Level
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="safetyLevel"
                  value="safe"
                  checked={safetyLevel === 'safe'}
                  onChange={() => setSafetyLevel('safe')}
                  className="mr-2"
                />
                <span className="text-green-600">Safe Area</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="safetyLevel"
                  value="caution"
                  checked={safetyLevel === 'caution'}
                  onChange={() => setSafetyLevel('caution')}
                  className="mr-2"
                />
                <span className="text-yellow-600">Use Caution</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="safetyLevel"
                  value="avoid"
                  checked={safetyLevel === 'avoid'}
                  onChange={() => setSafetyLevel('avoid')}
                  className="mr-2"
                />
                <span className="text-red-600">Avoid Area</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Safety Rating
            </label>
            <div className="flex items-center">
              <StarRating rating={rating} setRating={setRating} />
              <span className="ml-2 text-gray-600">({rating}/5)</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Rate this location from 1 (unsafe) to 5 (very safe)
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Information
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your safety experience or tips..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !content || !locationName || !selectedLocation}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePost;