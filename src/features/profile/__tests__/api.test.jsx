import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as usersApi from '../api';
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


describe('users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should call GET /users/me', async () => {
      const mockProfile = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      apiClient.get.mockResolvedValue({ data: mockProfile });

      const result = await usersApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockProfile);
    });

    it('should handle unauthorized error', async () => {
      apiClient.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(usersApi.getProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateProfile', () => {
    it('should call PUT /users/me with profile data', async () => {
      const profileData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com',
      };

      const mockUpdated = { id: 1, username: 'testuser', ...profileData };

      apiClient.put.mockResolvedValue({ data: mockUpdated });

      const result = await usersApi.updateProfile(profileData);

      expect(apiClient.put).toHaveBeenCalledWith('/users/me', profileData);
      expect(result).toEqual(mockUpdated);
    });

    it('should handle validation error', async () => {
      const invalidData = { email: 'invalid-email' };

      apiClient.put.mockRejectedValue(new Error('Invalid email format'));

      await expect(usersApi.updateProfile(invalidData)).rejects.toThrow('Invalid email format');
    });
  });

  describe('changePassword', () => {
    it('should call POST /users/me/change-password', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const mockResponse = { message: 'Password changed successfully' };

      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.changePassword(passwordData);

      expect(apiClient.post).toHaveBeenCalledWith('/users/me/change-password', passwordData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle wrong current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      apiClient.post.mockRejectedValue(new Error('Current password is incorrect'));

      await expect(usersApi.changePassword(passwordData)).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('getUserReviews', () => {
    it('should call GET /users/me/reviews with default params', async () => {
      const mockResponse = {
        content: [
          { id: 1, rating: 5, comment: 'Great!' },
        ],
        totalElements: 1,
      };

      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await usersApi.getUserReviews();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me/reviews', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /users/me/reviews with pagination', async () => {
      const params = { page: 0, size: 5 };

      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await usersApi.getUserReviews(params);

      expect(apiClient.get).toHaveBeenCalledWith('/users/me/reviews', { params });
    });
  });
});
