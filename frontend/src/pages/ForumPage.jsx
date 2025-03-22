import { useState } from 'react';
import FilterButtons from '../components/forum/FilterButtons';
import PostList from '../components/forum/PostList';
import CreatePost from '../components/forum/CreatePost';
import NearbyReviews from '../components/forum/NerbyReviews';
import { useLocation } from '../context/LocationContext';

const ForumPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const { currentLocation } = useLocation();
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Community Safety Forum</h1>
          <p className="text-gray-600">Share and discover safety information from women in your community.</p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-600 hover:text-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Deepfake Detection
          </button>
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      </div>
      
      {/* Only show search if not in nearby mode */}
      {activeFilter !== 'nearby' && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by location or content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}
      
      <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {activeFilter === 'nearby' ? (
        !currentLocation ? (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-4">
            <p className="font-medium">Location access required</p>
            <p>To see nearby reviews, please allow location access in your browser.</p>
          </div>
        ) : (
          <NearbyReviews />
        )
      ) : (
        <PostList filter={activeFilter} searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default ForumPage;