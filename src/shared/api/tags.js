import apiClient from './apiClient';


/**
 * Get all tags
 * GET /api/tags
 */
export const getTags = async () => {
  const response = await apiClient.get('/tags');

  return response.data;
};
