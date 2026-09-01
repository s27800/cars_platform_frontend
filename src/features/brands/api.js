import apiClient from '../../shared/api/apiClient';


/**
 * Get all brands
 * GET /api/brands
 */
export const getBrands = async () => {
  const response = await apiClient.get('/brands');

  return response.data;
};

/**
 * Get brand details with models
 * GET /api/brands/{id}
 */
export const getBrandById = async (id) => {
  const response = await apiClient.get(`/brands/${id}`);

  return response.data;
};
