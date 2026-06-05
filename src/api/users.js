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

/**
 * Get current user's reviews with pagination
 * GET /api/users/me/reviews
 * Requires authentication
 */
export const getUserReviews = async (params = {}) => {
  const response = await apiClient.get('/users/me/reviews', { params });

  return response.data;
};

/**
 * Get current user's fuel reports with pagination
 * GET /api/users/me/fuel-reports
 * Requires authentication
 */
export const getUserFuelReports = async (params = {}) => {
  const response = await apiClient.get('/users/me/fuel-reports', { params });

  return response.data;
};

/**
 * Get current user's data proposals with pagination
 * GET /api/users/me/data-proposals
 * Requires authentication
 */
export const getUserDataProposals = async (params = {}) => {
  const response = await apiClient.get('/users/me/data-proposals', { params });

  return response.data;
};
