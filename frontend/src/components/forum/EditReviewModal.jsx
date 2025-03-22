import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

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

const EditReviewModal = ({ isOpen, onClose, onSave, review }) => {
  const [content, setContent] = useState(review?.content || '');
  const [rating, setRating] = useState(review?.rating || 5);
  const [safetyLevel, setSafetyLevel] = useState(review?.safetyLevel || 'safe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content) {
      setError('Please enter some content for your review');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...review,
        content,
        rating,
        safetyLevel
      });
      
      onClose();
    } catch (error) {
      setError('Failed to update review. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Safety Review"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
            {review?.routeName || 'Unknown Location'}
          </div>
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
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || !content}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditReviewModal;