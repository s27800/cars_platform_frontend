import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as likesApi from '../likes';
import apiClient from '../apiClient';


// Mock apiClient
vi.mock('../apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));


describe('likes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Review Likes', () => {
    describe('toggleReviewLike', () => {
      it('should call POST /likes/review/{reviewId}', async () => {
        const reviewId = 123;
        const mockResponse = { liked: true, likeCount: 5 };

        apiClient.post.mockResolvedValue({ data: mockResponse });

        const result = await likesApi.toggleReviewLike(reviewId);

        expect(apiClient.post).toHaveBeenCalledWith('/likes/review/123');
        expect(result).toEqual(mockResponse);
      });

      it('should toggle like off', async () => {
        const reviewId = 123;
        const mockResponse = { liked: false, likeCount: 4 };

        apiClient.post.mockResolvedValue({ data: mockResponse });

        const result = await likesApi.toggleReviewLike(reviewId);

        expect(result.liked).toBe(false);
      });

      it('should handle unauthorized error', async () => {
        apiClient.post.mockRejectedValue(new Error('Unauthorized'));

        await expect(likesApi.toggleReviewLike(123)).rejects.toThrow('Unauthorized');
      });
    });

    describe('getReviewLikeStatus', () => {
      it('should call GET /likes/review/{reviewId}/status', async () => {
        const reviewId = 123;
        const mockStatus = { liked: true, likeCount: 10 };

        apiClient.get.mockResolvedValue({ data: mockStatus });

        const result = await likesApi.getReviewLikeStatus(reviewId);

        expect(apiClient.get).toHaveBeenCalledWith('/likes/review/123/status');
        expect(result).toEqual(mockStatus);
      });

      it('should return not liked status', async () => {
        const mockStatus = { liked: false, likeCount: 5 };

        apiClient.get.mockResolvedValue({ data: mockStatus });

        const result = await likesApi.getReviewLikeStatus(123);

        expect(result.liked).toBe(false);
      });
    });
  });

  describe('Fuel Report Likes', () => {
    describe('toggleFuelReportLike', () => {
      it('should call POST /likes/fuel-report/{fuelReportId}', async () => {
        const fuelReportId = 456;
        const mockResponse = { liked: true, likeCount: 3 };

        apiClient.post.mockResolvedValue({ data: mockResponse });

        const result = await likesApi.toggleFuelReportLike(fuelReportId);

        expect(apiClient.post).toHaveBeenCalledWith('/likes/fuel-report/456');
        expect(result).toEqual(mockResponse);
      });

      it('should handle unauthorized error', async () => {
        apiClient.post.mockRejectedValue(new Error('Unauthorized'));

        await expect(likesApi.toggleFuelReportLike(456)).rejects.toThrow('Unauthorized');
      });
    });

    describe('getFuelReportLikeStatus', () => {
      it('should call GET /likes/fuel-report/{fuelReportId}/status', async () => {
        const fuelReportId = 456;
        const mockStatus = { liked: false, likeCount: 7 };

        apiClient.get.mockResolvedValue({ data: mockStatus });

        const result = await likesApi.getFuelReportLikeStatus(fuelReportId);

        expect(apiClient.get).toHaveBeenCalledWith('/likes/fuel-report/456/status');
        expect(result).toEqual(mockStatus);
      });
    });
  });
});
