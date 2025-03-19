import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ForumPost from './ForumPost';
import Spinner from '../common/Spinner';

const PostList = ({ filter = 'all' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // In a real app, you would call your API here
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        const samplePosts = [
          {
            id: '1',
            author: {
              id: '123',
              name: 'Sarah Johnson'
            },
            content: 'The main paths in Central Park are well-lit and have regular security patrols. I frequently jog here in the early evening and feel safe. There are emergency phones throughout the park.',
            location: 'Central Park, New York',
            safetyLevel: 'safe',
            likes: 24,
            dislikes: 5,
            likedBy: [],
            dislikedBy: [],
            createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
          },
          {
            id: '2',
            author: {
              id: '456',
              name: 'Madison Lee'
            },
            content: 'This area gets very dark after sunset with some broken street lights. I\'d recommend avoiding the side streets off Broadway after 10pm. Main street is generally okay but stay alert.',
            location: 'Broadway & 34th St',
            safetyLevel: 'caution',
            likes: 17,
            dislikes: 8,
            likedBy: [],
            dislikedBy: [],
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ];
        
        setPosts(samplePosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.safetyLevel === filter);
  
  const handleLike = async (postId) => {
    // In a real app, you would call your API here
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(user.userId);
        const isDisliked = post.dislikedBy.includes(user.userId);
        
        let newLikes = post.likes;
        let newDislikes = post.dislikes;
        let newLikedBy = [...post.likedBy];
        let newDislikedBy = [...post.dislikedBy];
        
        if (isLiked) {
          // Unlike
          newLikes--;
          newLikedBy = newLikedBy.filter(id => id !== user.userId);
        } else {
          // Like
          newLikes++;
          newLikedBy.push(user.userId);
          
          // Remove dislike if exists
          if (isDisliked) {
            newDislikes--;
            newDislikedBy = newDislikedBy.filter(id => id !== user.userId);
          }
        }
        
        return {
          ...post,
          likes: newLikes,
          dislikes: newDislikes,
          likedBy: newLikedBy,
          dislikedBy: newDislikedBy
        };
      }
      return post;
    }));
  };
  
  const handleDislike = async (postId) => {
    // In a real app, you would call your API here
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(user.userId);
        const isDisliked = post.dislikedBy.includes(user.userId);
        
        let newLikes = post.likes;
        let newDislikes = post.dislikes;
        let newLikedBy = [...post.likedBy];
        let newDislikedBy = [...post.dislikedBy];
        
        if (isDisliked) {
          // Undislike
          newDislikes--;
          newDislikedBy = newDislikedBy.filter(id => id !== user.userId);
        } else {
          // Dislike
          newDislikes++;
          newDislikedBy.push(user.userId);
          
          // Remove like if exists
          if (isLiked) {
            newLikes--;
            newLikedBy = newLikedBy.filter(id => id !== user.userId);
          }
        }
        
        return {
          ...post,
          likes: newLikes,
          dislikes: newDislikes,
          likedBy: newLikedBy,
          dislikedBy: newDislikedBy
        };
      }
      return post;
    }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No posts found for this filter. Be the first to share information!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredPosts.map(post => (
        <ForumPost
          key={post.id}
          post={post}
          onLike={handleLike}
          onDislike={handleDislike}
          currentUserId={user?.userId}
        />
      ))}
    </div>
  );
};

export default PostList;
