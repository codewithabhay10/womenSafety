import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ForumPost from './ForumPost';
import EditReviewModal from './EditReviewModal';
import Spinner from '../common/Spinner';
import { 
  getAllReviews, 
  likeReview, 
  dislikeReview,
  updateReview,
  deleteReview 
} from '../../services/forum';

const PostList = ({ filter = 'all', searchQuery = '' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const { user } = useAuth();
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllReviews();
      setPosts(response);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Apply filters and search
  const getFilteredPosts = () => {
    // First, filter by safety level/rating
    let filteredByRating = filter === 'all' 
      ? posts 
      : filter === 'safe'
        ? posts.filter(post => post.rating === 5)
        : filter === 'caution'
          ? posts.filter(post => post.rating >= 3 && post.rating <= 4)
          : posts.filter(post => post.rating <= 2); // 'avoid'
    
    // Then, apply search query if it exists
    if (searchQuery.trim() === '') {
      return filteredByRating;
    }
    
    // Case-insensitive search
    const query = searchQuery.toLowerCase();
    
    return filteredByRating.filter(post => {
      // Search in location name
      const locationMatch = post.routeName?.toLowerCase().includes(query);
      
      // Search in content
      const contentMatch = post.content?.toLowerCase().includes(query);
      
      // Return if either matches
      return locationMatch || contentMatch;
    });
  };
  
  const filteredPosts = getFilteredPosts();
  
  const handleLike = async (postId) => {
    if (!user) return;
    
    try {
      // Call the API to like/unlike the post
      const response = await likeReview(postId, user.userId);
      
      // Update the posts state with the new like/unlike info
      setPosts(posts.map(post => {
        if (post._id === postId) {
          // Update the post with the new like/dislike counts
          return {
            ...post,
            likes: response.likes,
            dislikes: response.dislikes,
            likedBy: post.likedBy 
              ? (post.likedBy.includes(user.userId) 
                  ? post.likedBy.filter(id => id !== user.userId) 
                  : [...post.likedBy, user.userId])
              : [user.userId],
            dislikedBy: post.dislikedBy 
              ? post.dislikedBy.filter(id => id !== user.userId) 
              : []
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  
  const handleDislike = async (postId) => {
    if (!user) return;
    
    try {
      // Call the API to dislike/undislike the post
      const response = await dislikeReview(postId, user.userId);
      
      // Update the posts state with the new dislike/undislike info
      setPosts(posts.map(post => {
        if (post._id === postId) {
          // Update the post with the new like/dislike counts
          return {
            ...post,
            likes: response.likes,
            dislikes: response.dislikes,
            dislikedBy: post.dislikedBy 
              ? (post.dislikedBy.includes(user.userId) 
                  ? post.dislikedBy.filter(id => id !== user.userId) 
                  : [...post.dislikedBy, user.userId])
              : [user.userId],
            likedBy: post.likedBy 
              ? post.likedBy.filter(id => id !== user.userId) 
              : []
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to dislike post:', error);
    }
  };
  
  const handleEdit = (post) => {
    setEditingPost(post);
  };
  
  const handleEditSave = async (updatedPost) => {
    try {
      const response = await updateReview(updatedPost._id, {
        userId: user.userId,
        routeName: updatedPost.routeName,
        content: updatedPost.content,
        rating: updatedPost.rating
      });
      
      // Update posts state with the updated post
      setPosts(posts.map(post => 
        post._id === updatedPost._id ? { ...post, ...response } : post
      ));
      
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };
  
  const handleDelete = async (postId) => {
    try {
      await deleteReview(postId, user.userId);
      
      // Remove the deleted post from state
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  
  const handleReport = () => {
    alert('Report functionality will be implemented in a future update.');
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
        {searchQuery.trim() !== '' 
          ? `No posts found matching "${searchQuery}". Try another search term.` 
          : "No posts found for this filter. Be the first to share information!"}
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <ForumPost
            key={post._id}
            post={post}
            onLike={handleLike}
            onDislike={handleDislike}
            onReport={handleReport}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={user?.userId}
          />
        ))}
      </div>
      
      {editingPost && (
        <EditReviewModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleEditSave}
          review={editingPost}
        />
      )}
    </>
  );
};

export default PostList;