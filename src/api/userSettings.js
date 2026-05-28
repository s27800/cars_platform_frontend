import apiClient from './apiClient';


/**
 * Get current user's settings
 * GET /api/user-settings
 * Requires authentication
 */
export const getSettings = async () => {
  const response = await apiClient.get('/user-settings');

  return response.data;
};

/**
 * Update current user's settings
 * PUT /api/user-settings
 * Requires authentication
 * 
 * @param {Object} settingsData - Settings to update
 * @param {string} settingsData.theme - Theme preference
 */
export const updateSettings = async (settingsData) => {
  const response = await apiClient.put('/user-settings', settingsData);

  return response.data;
};
