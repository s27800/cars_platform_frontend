import apiClient from '../../shared/api/apiClient';


/**
 * Get all body types
 * GET /api/body-types
 */
export const getBodyTypes = async () => {
  const response = await apiClient.get('/body-types');

  return response.data;
};
