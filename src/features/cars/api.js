import apiClient from '../../shared/api/apiClient';


/**
 * Get car details by ID
 * GET /api/cars/{id}
 */
export const getCarById = async (id) => {
  const response = await apiClient.get(`/cars/${id}`);

  return response.data;
};

/**
 * Search cars with filters and pagination
 * GET /api/cars/search
 *
 * @param {Object} params - Search parameters
 * @param {string} params.search - Text search query
 * @param {number[]} params.brandIds - Filter by brand IDs
 * @param {number[]} params.modelIds - Filter by model IDs
 * @param {number[]} params.generationIds - Filter by generation IDs
 * @param {number[]} params.bodyTypeIds - Filter by body type IDs
 * @param {number[]} params.tagIds - Filter by tag IDs
 * @param {number} params.minDisplacement - Minimum engine displacement
 * @param {number} params.maxDisplacement - Maximum engine displacement
 * @param {string[]} params.engineTypes - Filter by engine types
 * @param {number} params.minPower - Minimum power (HP)
 * @param {number} params.maxPower - Maximum power (HP)
 * @param {number} params.minTorque - Minimum torque (Nm)
 * @param {number} params.maxTorque - Maximum torque (Nm)
 * @param {string[]} params.drives - Filter by drive types (FWD, RWD, AWD)
 * @param {string[]} params.transmissionTypes - Filter by transmission types
 * @param {number} params.minSpeed - Minimum top speed
 * @param {number} params.maxSpeed - Maximum top speed
 * @param {number} params.minFuelConsumptionMixed - Minimum fuel consumption
 * @param {number} params.maxFuelConsumptionMixed - Maximum fuel consumption
 * @param {number} params.page - Page number
 * @param {number} params.size - Page size
 * @param {string} params.sort - Sort details
 */
export const searchCars = async (params = {}) => {
  const response = await apiClient.get('/cars/search', { params });

  return response.data;
};

/**
 * Get similar cars for a specific car
 * GET /api/cars/{id}/similar
 *
 * @param {number} carId - Car ID
 * @param {number} limit - Maximum number of similar cars to return (default: 4)
 */
export const getSimilarCars = async (carId, limit = 4) => {
  const response = await apiClient.get(`/cars/${carId}/similar`, {
    params: { limit }
  });

  return response.data;
};
