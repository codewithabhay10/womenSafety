import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import Button from '../common/Button';
import Modal from '../common/Modal';

const CreatePost = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [safetyLevel, setSafetyLevel] = useState('safe');
  const [locationName, setLocationName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content || !locationName) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your API here
      const newPost = {
        id: Date.now().toString(),
        author: {
          id: user.userId,
          name: user.name
        },
        content,
        location: locationName,
        safetyLevel,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        createdAt: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onPostCreated(newPost);
      setIsOpen(false);
      setContent('');
      setLocationName('');
      setSafetyLevel('safe');
    } catch (error) {
      console.error('Failed to create post:', error);
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
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter location name"
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
              disabled={isSubmitting || !content || !locationName}
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
