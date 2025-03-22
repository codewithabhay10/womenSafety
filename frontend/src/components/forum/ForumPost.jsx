import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ForumPost = ({ 
  post, 
  onLike, 
  onDislike, 
  onReport, 
  onEdit, 
  onDelete, 
  currentUserId 
}) => {
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUserId));
  const [disliked, setDisliked] = useState(post.dislikedBy?.includes(currentUserId));
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Check if current user is the author of this post
  const isAuthor = currentUserId && post.userId && 
    (post.userId._id === currentUserId || post.userId === currentUserId);
  
  // Get user name (safely handle both populated and non-populated cases)
  const userName = post.userId?.name || 'Anonymous User';
  
  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      setLikes(prev => prev - 1);
    } else {
      setLiked(true);
      setLikes(prev => prev + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes(prev => prev - 1);
      }
    }
    
    if (onLike) {
      await onLike(post._id);
    }
  };
  
  const handleDislike = async () => {
    if (disliked) {
      setDisliked(false);
      setDislikes(prev => prev - 1);
    } else {
      setDisliked(true);
      setDislikes(prev => prev + 1);
      if (liked) {
        setLiked(false);
        setLikes(prev => prev - 1);
      }
    }
    
    if (onDislike) {
      await onDislike(post._id);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(post._id);
      setShowDeleteConfirm(false);
    }
  };
  
  // Get safety badge based on rating
  const getSafetyBadge = () => {
    const rating = post.rating || 0;
    
    if (rating === 5) {
      return <Badge variant="success">Safe Area</Badge>;
    } else if (rating >= 3 && rating <= 4) {
      return <Badge variant="warning">Use Caution</Badge>;
    } else {
      return <Badge variant="danger">Avoid Area</Badge>;
    }
  };
  
  // Format date safely
  const formattedDate = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : 'Recently';
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar name={userName} size="md" className="mr-3" />
          <div>
            <h3 className="font-medium">{userName}</h3>
            <div className="text-gray-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {post.routeName || 'Unknown Location'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getSafetyBadge()}
          
          {isAuthor && (
            <div className="relative">
              <button 
                onClick={() => setShowActions(!showActions)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <button 
                    onClick={() => {
                      setShowActions(false);
                      onEdit(post);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Review
                  </button>
                  <button 
                    onClick={() => {
                      setShowActions(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <p className="mb-4">{post.content}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center ${liked ? 'text-primary-500' : 'text-gray-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {likes}
          </button>
          
          <button 
            onClick={handleDislike}
            className={`flex items-center ${disliked ? 'text-primary-500' : 'text-gray-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            {dislikes}
          </button>
          
          <button 
            onClick={() => onReport && onReport(post._id)}
            className="text-gray-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 00-1-1V6z" clipRule="evenodd" />
            </svg>
            Report
          </button>
        </div>
        
        <div className="text-gray-500">
          {formattedDate}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Review"
        size="sm"
      >
        <p className="mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <Button 
            variant="ghost" 
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ForumPost;