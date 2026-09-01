import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authApi from '../auth';
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


describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should call POST /auth/login with credentials', async () => {
      const credentials = { username: 'testuser', password: 'password123' };
      const mockResponse = { data: { token: 'jwt-token', user: { id: 1, username: 'testuser' } } };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const credentials = { username: 'testuser', password: 'wrongpassword' };
      const error = new Error('Invalid credentials');

      apiClient.post.mockRejectedValue(error);

      await expect(authApi.login(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should call POST /auth/register with user data', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockResponse = { data: { token: 'jwt-token', user: { id: 2, username: 'newuser' } } };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authApi.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration error', async () => {
      const userData = { username: 'existinguser', email: 'test@test.com', password: 'pass' };
      const error = new Error('Username already exists');

      apiClient.post.mockRejectedValue(error);

      await expect(authApi.register(userData)).rejects.toThrow('Username already exists');
    });
  });
});
