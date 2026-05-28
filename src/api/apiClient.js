import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token)
      config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {

        // Unauthorized
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;

        // Forbidden
        case 403:
          console.error('Access denied');
          break;
        
        // Not found
        case 404:
          console.error('Resource not found');
          break;

        // Server error
        case 500:
          console.error('Server error');
          break;
        
        // Other errors
        default:
          console.error('Request failed:', response.data?.message || 'Unknown error');
      }
    } else if (error.request) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
