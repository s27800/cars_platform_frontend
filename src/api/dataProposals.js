import apiClient from './apiClient';


// ============ User Actions ============

/**
 * Create a new data change proposal for a car
 * POST /api/data-proposals/{carId}
 * Requires authentication
 */
export const createProposal = async (carId, proposalData) => {
  const response = await apiClient.post(`/data-proposals/${carId}`, proposalData);

  return response.data;
};

/**
 * Get current user's data proposals
 * GET /api/data-proposals/me
 * Requires authentication
 */
export const getMyProposals = async (params = {}) => {
  const response = await apiClient.get('/data-proposals/me', { params });

  return response.data;
};


// ============ Admin Actions ============

/**
 * Get pending data proposals
 * GET /api/data-proposals/pending
 * Requires ADMIN role
 */
export const getPendingProposals = async (params = {}) => {
  const response = await apiClient.get('/data-proposals/pending', { params });

  return response.data;
};

/**
 * Resolve pending data proposal
 * PATCH /api/data-proposals/resolve/{id}
 * Requires ADMIN role
 * 
 * @param {number} id - Proposal ID
 * @param {boolean} approve - Approval decision
 * @param {string} adminComment - Optional comment
 */
export const resolveProposal = async (id, approve, adminComment = null) => {
  const params = { approve };

  if (adminComment)
    params.adminComment = adminComment;

  const response = await apiClient.patch(`/data-proposals/resolve/${id}`, null, { params });

  return response.data;
};
