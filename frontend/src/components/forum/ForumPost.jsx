import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const ForumPost = ({ post, onLike, onDislike, onReport, currentUserId }) => {
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUserId));
  const [disliked, setDisliked] = useState(post.dislikedBy?.includes(currentUserId));
  const [likes, setLikes] = useState(post.likes || 0);
  const [dislikes, setDislikes] = useState(post.dislikes || 0);
  
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
      await onLike(post.id);
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
      await onDislike(post.id);
    }
  };
  
  const getSafetyBadge = () => {
    switch (post.safetyLevel) {
      case 'safe':
        return <Badge variant="success">Safe Area</Badge>;
      case 'caution':
        return <Badge variant="warning">Use Caution</Badge>;
      case 'avoid':
        return <Badge variant="danger">Avoid Area</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar name={post.author.name} size="md" className="mr-3" />
          <div>
            <h3 className="font-medium">{post.author.name}</h3>
            <div className="text-gray-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {post.location}
            </div>
          </div>
        </div>
        {getSafetyBadge()}
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
            onClick={() => onReport && onReport(post.id)}
            className="text-gray-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1-1V8a1 1 0 00-1-1V6z" clipRule="evenodd" />
            </svg>
            Report
          </button>
        </div>
        
        <div className="text-gray-500">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
