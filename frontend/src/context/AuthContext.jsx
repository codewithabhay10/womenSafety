import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, getProfile } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      getProfile(userId)
        .then(data => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error('Failed to fetch user profile:', err);
          localStorage.removeItem('userId');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      if (data.success) {
        localStorage.setItem('userId', data.userId);
        setUser(data);
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
        setUser(data);
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
    // Implement profile update logic
    // This is a placeholder
    console.log('Updating profile for user:', userId, userData);
    setUser(prev => ({...prev, ...userData}));
    return { success: true };
  };

  const updateEmergencyContacts = async (userId, contacts) => {
    // Implement emergency contacts update logic
    // This is a placeholder
    console.log('Updating emergency contacts for user:', userId, contacts);
    setUser(prev => ({...prev, emergencyContacts: contacts}));
    return { success: true };
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateEmergencyContacts
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
