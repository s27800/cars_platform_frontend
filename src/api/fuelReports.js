import apiClient from './apiClient';


// ============ Public Actions ============

/**
 * Get fuel reports for a car with pagination
 * GET /api/fuel-reports/{carId}
 */
export const getFuelReports = async (carId, params = {}) => {
  const response = await apiClient.get(`/fuel-reports/${carId}`, { params });

  return response.data;
};

/**
 * Get average fuel consumption for a car
 * GET /api/fuel-reports/{carId}/average-consumption
 */
export const getAverageConsumption = async (carId) => {
  const response = await apiClient.get(`/fuel-reports/${carId}/average-consumption`);

  return response.data;
};


// ============ User Actions ============

/**
 * Create a new fuel report for a car
 * POST /api/fuel-reports/{carId}
 * Requires authentication
 */
export const createFuelReport = async (carId, reportData) => {
  const response = await apiClient.post(`/fuel-reports/${carId}`, reportData);

  return response.data;
};
