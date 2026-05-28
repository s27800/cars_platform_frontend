import apiClient from './apiClient';


/**
 * Get current user's profile
 * GET /api/users/me
 * Requires authentication
 */
export const getProfile = async () => {
  const response = await apiClient.get('/users/me');

  return response.data;
};

/**
 * Update current user's profile
 * PUT /api/users/me
 * Requires authentication
 */
export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/users/me', profileData);

  return response.data;
};

/**
 * Change current user's password
 * POST /api/users/me/change-password
 * Requires authentication
 */
export const changePassword = async (passwordData) => {
  const response = await apiClient.post('/users/me/change-password', passwordData);
  
  return response.data;
};
