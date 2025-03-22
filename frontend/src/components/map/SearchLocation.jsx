import { useState } from 'react';

const SearchLocation = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search location');
      }
      
      const data = await response.json();
      setSuggestions(data);
      
      // If we got a good result, use the first one
      if (data.length > 0) {
        const location = data[0];
        onSearch({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          address: location.display_name
        });
      } else {
        setError('No locations found. Try a different search term.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Could not find this location. Try another search term.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  const handleSuggestionClick = (suggestion) => {
    onSearch({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name
    });
    setQuery(suggestion.display_name.split(',')[0]);
    setSuggestions([]);
  };
  
  return (
    // Add position-relative here to properly position the dropdown
    <div className="relative" style={{ zIndex: 1000 }}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search for a destination or click on the map..."
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          type="submit" 
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          ) : (
            <div className={`${query.trim() ? 'bg-primary-500' : 'bg-gray-300'} text-white p-1 rounded-full`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </form>
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 text-red-700 text-sm rounded-md" style={{ zIndex: 1100 }}>
          {error}
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto" 
          style={{ zIndex: 1100 }} // Very high z-index to ensure it appears above the map
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
              <div className="text-sm text-gray-500 truncate">{suggestion.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchLocation;