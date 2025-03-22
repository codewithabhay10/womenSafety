import { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  getProfile, 
  updateProfile as updateProfileService,
  updateEmergencyContacts as updateContactsService,
  sendSOS as sendSOSService
} from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Improved session restoration
  useEffect(() => {
    const restoreSession = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getProfile(userId);
        
        if (userData) {
          // Make sure we're setting all needed properties from the response
          setUser({
            userId: userData._id || userData.userId,
            name: userData.name,
            email: userData.email,
            ...userData // Include any other properties returned by getProfile
          });
          setIsAuthenticated(true);
          console.log("Session restored successfully");
        } else {
          // Clear localStorage if the profile fetch returned empty data
          console.error("Failed to restore session - empty user data");
          localStorage.removeItem('userId');
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      if (data.success) {
        // Store the userId in localStorage for session persistence
        localStorage.setItem('userId', data.userId);
        
        // Make sure to set all necessary user data
        setUser({
          userId: data.userId,
          name: data.name,
          email: data.email,
          ...data // Include any other properties from the response
        });
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      if (data.success) {
        localStorage.setItem('userId', data.userId);
        
        // Ensure we're setting all needed user properties
        setUser({
          userId: data.userId,
          name: data.name,
          email: data.email,
          ...data // Include any other properties from the response
        });
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userId, userData) => {
    try {
      // Using the actual API call from auth.js service
      const updatedUser = await updateProfileService(userId, userData);
      
      // Update the user state with data returned from API
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        // Ensure userId is preserved (might be _id in the response)
        userId: prev.userId
      }));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Failed to update profile' 
      };
    }
  };

  const updateEmergencyContacts = async (userId, contacts) => {
    try {
      // Using the actual API call from auth.js service
      const updatedUser = await updateContactsService(userId, contacts);
      
      // Update the user state with new contacts from the API response
      setUser(prev => ({
        ...prev,
        emergencyContacts: updatedUser.emergencyContacts || contacts
      }));
      
      return { success: true, contacts: updatedUser.emergencyContacts || contacts };
    } catch (error) {
      console.error('Failed to update emergency contacts:', error);
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Failed to update emergency contacts' 
      };
    }
  };

  const sendSOS = async (location) => {
    if (!user || !user.userId) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await sendSOSService(user.userId, location);
      
      return { 
        success: true, 
        message: 'SOS alert sent successfully',
        ...result
      };
    } catch (error) {
      console.error('Failed to send SOS alert:', error);
      return {
        success: false,
        error: error.response?.data?.msg || 'Failed to send SOS alert'
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateEmergencyContacts,
    sendSOS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;