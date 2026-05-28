import apiClient from './apiClient';


// ============ Reviews Moderation ============

/**
 * Get pending reviews waiting for approval
 * GET /api/admin/reviews/pending
 * Requires ADMIN role
 */
export const getPendingReviews = async (params = {}) => {
  const response = await apiClient.get('/admin/reviews/pending', { params });
  
  return response.data;
};

/**
 * Resolve pending review
 * PATCH /api/admin/reviews/{id}/approve
 * Requires ADMIN role
 * 
 * @param {number} id - Review ID
 * @param {boolean} approve - Approval decision
 */
export const approveReview = async (id, approve) => {
  const response = await apiClient.patch(`/admin/reviews/${id}/approve`, null, {
    params: { approve }
  });

  return response.data;
};


// ============ Fuel Reports Moderation ============

/**
 * Get pending fuel reports waiting for approval
 * GET /api/admin/fuel-reports/pending
 * Requires ADMIN role
 */
export const getPendingFuelReports = async (params = {}) => {
  const response = await apiClient.get('/admin/fuel-reports/pending', { params });

  return response.data;
};

/**
 * Resolve pending fuel report
 * PATCH /api/admin/fuel-reports/{id}/approve
 * Requires ADMIN role
 * 
 * @param {number} id - Fuel report ID
 * @param {boolean} approve - Approval decision
 */
export const approveFuelReport = async (id, approve) => {
  const response = await apiClient.patch(`/admin/fuel-reports/${id}/approve`, null, {
    params: { approve }
  });
  
  return response.data;
};
