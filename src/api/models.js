import apiClient from './apiClient';


/**
 * Get model details with generations
 * GET /api/models/{id}
 */
export const getModelById = async (id) => {
  const response = await apiClient.get(`/models/${id}`);
  
  return response.data;
};
