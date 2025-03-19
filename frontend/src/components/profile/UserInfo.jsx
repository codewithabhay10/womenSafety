import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const UserInfo = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
    
    try {
      await updateProfile(user.userId, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
        <Avatar name={user?.name} size="lg" />
      </div>
      
      <h1 className="text-2xl font-bold">{user?.name}</h1>
      <p className="text-gray-500">{user?.location || 'New York, NY'}</p>
      
      <Button 
        variant="ghost"
        size="sm"
        className="mt-2"
        onClick={() => setIsEditing(true)}
      >
        Edit Profile
      </Button>
      
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />
          
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
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
    </div>
  );
};

export default UserInfo;
