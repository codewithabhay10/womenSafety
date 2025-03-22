import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Card from '../common/Card';

const UserInfo = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await updateProfile(user.userId, formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="flex-shrink-0">
          <div className="bg-primary-50 p-4 rounded-full border border-primary-100">
            <Avatar name={user?.name} size="lg" />
          </div>
        </div>
        
        <div className="flex-grow space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="font-medium">{user?.name || '—'}</p>
          </div>
          
          <div className="border-b border-gray-100 pb-2">
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {user?.email || '—'}
            </p>
          </div>
          
          <div className="text-sm text-gray-500 pt-2">
            <p>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
          />
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default UserInfo;