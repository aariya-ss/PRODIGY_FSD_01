import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Crucial for HTTP-Only cookie transfer
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to handle global api error formatting if necessary
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return custom error payload if structured by backend
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ success: false, message: error.message || 'API connection failed.' });
  }
);

export default api;
