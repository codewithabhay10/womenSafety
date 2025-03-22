import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include userId from localStorage
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    
    // If userId exists, add it to request headers or params
    if (userId) {
      // You could add it as a header
      config.headers['User-ID'] = userId;
      
      // For POST/PUT requests, you could also ensure userId is in the body
      if ((config.method === 'post' || config.method === 'put') && config.data) {
        // Only add userId if it's not already in the data
        if (typeof config.data === 'string') {
          try {
            const data = JSON.parse(config.data);
            if (!data.userId) {
              const newData = { ...data, userId };
              config.data = JSON.stringify(newData);
            }
          } catch (e) {
            console.error('Error parsing request data', e);
          }
        } else if (typeof config.data === 'object' && !config.data.userId) {
          config.data.userId = userId;
        }
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;