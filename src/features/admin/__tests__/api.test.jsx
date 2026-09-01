import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as adminApi from '../api';
import apiClient from '../../../shared/api/apiClient';


// Mock apiClient
vi.mock('../../../shared/api/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));


describe('admin API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Reviews Moderation', () => {
    describe('getPendingReviews', () => {
      it('should call GET /admin/reviews/pending with default params', async () => {
        const mockResponse = {
          content: [
            { id: 1, comment: 'Great car!', status: 'PENDING' },
            { id: 2, comment: 'Nice ride', status: 'PENDING' },
          ],
          totalElements: 2,
        };

        apiClient.get.mockResolvedValue({ data: mockResponse });

        const result = await adminApi.getPendingReviews();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/reviews/pending', { params: {} });
        expect(result).toEqual(mockResponse);
      });

      it('should call GET /admin/reviews/pending with pagination', async () => {
        const params = { page: 0, size: 10 };

        apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

        await adminApi.getPendingReviews(params);

        expect(apiClient.get).toHaveBeenCalledWith('/admin/reviews/pending', { params });
      });

      it('should handle forbidden error for non-admin', async () => {
        apiClient.get.mockRejectedValue(new Error('Access denied'));

        await expect(adminApi.getPendingReviews()).rejects.toThrow('Access denied');
      });
    });

    describe('approveReview', () => {
      it('should call PATCH /admin/reviews/{id}/approve to approve', async () => {
        const reviewId = 1;
        const mockApproved = { id: 1, status: 'APPROVED' };

        apiClient.patch.mockResolvedValue({ data: mockApproved });

        const result = await adminApi.approveReview(reviewId, true);

        expect(apiClient.patch).toHaveBeenCalledWith(
          '/admin/reviews/1/approve',
          null,
          { params: { approve: true } }
        );

        expect(result.status).toBe('APPROVED');
      });

      it('should call PATCH /admin/reviews/{id}/approve to reject', async () => {
        const reviewId = 1;
        const mockRejected = { id: 1, status: 'REJECTED' };

        apiClient.patch.mockResolvedValue({ data: mockRejected });

        const result = await adminApi.approveReview(reviewId, false);

        expect(apiClient.patch).toHaveBeenCalledWith(
          '/admin/reviews/1/approve',
          null,
          { params: { approve: false } }
        );

        expect(result.status).toBe('REJECTED');
      });

      it('should handle forbidden error for non-admin', async () => {
        apiClient.patch.mockRejectedValue(new Error('Access denied'));

        await expect(adminApi.approveReview(1, true)).rejects.toThrow('Access denied');
      });
    });
  });

  describe('Fuel Reports Moderation', () => {
    describe('getPendingFuelReports', () => {
      it('should call GET /admin/fuel-reports/pending with default params', async () => {
        const mockResponse = {
          content: [
            { id: 1, consumption: 8.5, status: 'PENDING' },
          ],
          totalElements: 1,
        };

        apiClient.get.mockResolvedValue({ data: mockResponse });

        const result = await adminApi.getPendingFuelReports();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/fuel-reports/pending', { params: {} });
        expect(result).toEqual(mockResponse);
      });

      it('should call GET /admin/fuel-reports/pending with pagination', async () => {
        const params = { page: 1, size: 20 };

        apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

        await adminApi.getPendingFuelReports(params);

        expect(apiClient.get).toHaveBeenCalledWith('/admin/fuel-reports/pending', { params });
      });

      it('should handle forbidden error for non-admin', async () => {
        apiClient.get.mockRejectedValue(new Error('Access denied'));

        await expect(adminApi.getPendingFuelReports()).rejects.toThrow('Access denied');
      });
    });

    describe('approveFuelReport', () => {
      it('should call PATCH /admin/fuel-reports/{id}/approve to approve', async () => {
        const reportId = 1;
        const mockApproved = { id: 1, status: 'APPROVED' };

        apiClient.patch.mockResolvedValue({ data: mockApproved });

        const result = await adminApi.approveFuelReport(reportId, true);

        expect(apiClient.patch).toHaveBeenCalledWith(
          '/admin/fuel-reports/1/approve',
          null,
          { params: { approve: true } }
        );

        expect(result.status).toBe('APPROVED');
      });

      it('should call PATCH /admin/fuel-reports/{id}/approve to reject', async () => {
        const reportId = 1;
        const mockRejected = { id: 1, status: 'REJECTED' };

        apiClient.patch.mockResolvedValue({ data: mockRejected });

        const result = await adminApi.approveFuelReport(reportId, false);

        expect(apiClient.patch).toHaveBeenCalledWith(
          '/admin/fuel-reports/1/approve',
          null,
          { params: { approve: false } }
        );

        expect(result.status).toBe('REJECTED');
      });

      it('should handle forbidden error for non-admin', async () => {
        apiClient.patch.mockRejectedValue(new Error('Access denied'));

        await expect(adminApi.approveFuelReport(1, true)).rejects.toThrow('Access denied');
      });
    });
  });
});
