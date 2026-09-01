import apiClient from './apiClient';


// ============ Review Likes ============

/**
 * Toggle like for a review
 * POST /api/likes/review/{reviewId}
 * Requires authentication
 */
export const toggleReviewLike = async (reviewId) => {
  const response = await apiClient.post(`/likes/review/${reviewId}`);

  return response.data;
};

/**
 * Get like status and count for a review
 * GET /api/likes/review/{reviewId}/status
 * Requires authentication
 */
export const getReviewLikeStatus = async (reviewId) => {
  const response = await apiClient.get(`/likes/review/${reviewId}/status`);

  return response.data;
};


// ============ Fuel Report Likes ============

/**
 * Toggle like for a fuel report
 * POST /api/likes/fuel-report/{fuelReportId}
 * Requires authentication
 */
export const toggleFuelReportLike = async (fuelReportId) => {
  const response = await apiClient.post(`/likes/fuel-report/${fuelReportId}`);

  return response.data;
};

/**
 * Get like status and count for a fuel report
 * GET /api/likes/fuel-report/{fuelReportId}/status
 * Requires authentication
 */
export const getFuelReportLikeStatus = async (fuelReportId) => {
  const response = await apiClient.get(`/likes/fuel-report/${fuelReportId}/status`);

  return response.data;
};
