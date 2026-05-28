import apiClient from './apiClient';


/**
 * Get generation details with cars
 * GET /api/generations/{id}
 */
export const getGenerationById = async (id) => {
  const response = await apiClient.get(`/generations/${id}`);
  
  return response.data;
};
