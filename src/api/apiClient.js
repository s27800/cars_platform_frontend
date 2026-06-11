import axios from 'axios';
import { showToast } from '../components/ui/Toast';


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
      const message = response.data?.message || response.data?.error;
      
      switch (response.status) {

        // Unauthorized
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          showToast.warning('Session expired. Please log in again.');
          window.location.href = '/login';
          break;

        // Forbidden
        case 403:
          showToast.error('Access denied. You don\'t have permission to perform this action.');
          break;
        
        // Not found
        case 404:
          showToast.error(message || 'The requested resource was not found.');
          break;

        // Validation errors
        case 400:
          showToast.warning(message || 'Invalid request. Please check your input.');
          break;

        // Conflict
        case 409:
          showToast.warning(message || 'This action conflicts with existing data.');
          break;

        // Server error
        case 500:
          showToast.error('Server error. Please try again later.');
          break;
        
        // Other errors
        default:
          showToast.error(message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      showToast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
