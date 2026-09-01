import apiClient from './apiClient';


/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);

  return response.data;
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);

  return response.data;
};
