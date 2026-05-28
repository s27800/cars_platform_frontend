import apiClient from './apiClient';


// ============ Public Actions ===========

/**
 * Get reviews for a car with pagination
 * GET /api/reviews/{carId}
 */
export const getReviews = async (carId, params = {}) => {
  const response = await apiClient.get(`/reviews/${carId}`, { params });

  return response.data;
};

/**
 * Get average ratings for a car
 * GET /api/reviews/{carId}/average-ratings
 */
export const getAverageRatings = async (carId) => {
  const response = await apiClient.get(`/reviews/${carId}/average-ratings`);

  return response.data;
};


// ============ User Actions ============

/**
 * Create a new review for a car
 * POST /api/reviews/{carId}
 * Requires authentication
 */
export const createReview = async (carId, reviewData) => {
  const response = await apiClient.post(`/reviews/${carId}`, reviewData);

  return response.data;
};
