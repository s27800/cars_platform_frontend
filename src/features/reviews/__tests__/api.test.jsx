import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as reviewsApi from '../api';
import apiClient from '../../../shared/api/apiClient';


// Mock apiClient
vi.mock('../../../shared/api/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));


describe('reviews API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getReviews', () => {
    it('should call GET /reviews/{carId} with default params', async () => {
      const carId = 123;
      const mockResponse = {
        content: [
          { id: 1, rating: 5, comment: 'Great car!' },
          { id: 2, rating: 4, comment: 'Good car' },
        ],
        totalElements: 2,
        totalPages: 1,
      };

      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await reviewsApi.getReviews(carId);

      expect(apiClient.get).toHaveBeenCalledWith('/reviews/123', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /reviews/{carId} with pagination', async () => {
      const carId = 123;
      const params = { page: 1, size: 5 };

      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await reviewsApi.getReviews(carId, params);

      expect(apiClient.get).toHaveBeenCalledWith('/reviews/123', { params });
    });

    it('should handle fetch error', async () => {
      apiClient.get.mockRejectedValue(new Error('Failed to fetch reviews'));

      await expect(reviewsApi.getReviews(123)).rejects.toThrow('Failed to fetch reviews');
    });
  });

  describe('getAverageRatings', () => {
    it('should call GET /reviews/{carId}/average-ratings', async () => {
      const carId = 123;
      const mockRatings = {
        overallRating: 4.5,
        engineRating: 4.8,
        comfortRating: 4.2,
        handlingRating: 4.6,
        totalReviews: 25,
      };

      apiClient.get.mockResolvedValue({ data: mockRatings });

      const result = await reviewsApi.getAverageRatings(carId);

      expect(apiClient.get).toHaveBeenCalledWith('/reviews/123/average-ratings');
      expect(result).toEqual(mockRatings);
    });

    it('should handle no ratings', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await reviewsApi.getAverageRatings(123);

      expect(result).toBeNull();
    });
  });

  describe('createReview', () => {
    it('should call POST /reviews/{carId} with review data', async () => {
      const carId = 123;
      const reviewData = {
        overallRating: 5,
        engineRating: 5,
        comfortRating: 4,
        comment: 'Amazing car!',
      };

      const mockCreated = { id: 1, ...reviewData, carId };

      apiClient.post.mockResolvedValue({ data: mockCreated });

      const result = await reviewsApi.createReview(carId, reviewData);

      expect(apiClient.post).toHaveBeenCalledWith('/reviews/123', reviewData);
      expect(result).toEqual(mockCreated);
    });

    it('should handle validation error', async () => {
      const carId = 123;
      const invalidData = { comment: 'No ratings provided' };

      apiClient.post.mockRejectedValue(new Error('Rating is required'));

      await expect(reviewsApi.createReview(carId, invalidData)).rejects.toThrow('Rating is required');
    });

    it('should handle unauthorized error', async () => {
      apiClient.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(reviewsApi.createReview(123, {})).rejects.toThrow('Unauthorized');
    });
  });
});
