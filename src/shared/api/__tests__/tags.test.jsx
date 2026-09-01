import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as tagsApi from '../tags';
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


describe('tags API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTags', () => {
    it('should call GET /tags', async () => {
      const mockTags = [
        { id: 1, name: 'Sports', color: '#FF0000' },
        { id: 2, name: 'Luxury', color: '#FFD700' },
        { id: 3, name: 'Family', color: '#0000FF' },
        { id: 4, name: 'Eco', color: '#00FF00' },
      ];

      apiClient.get.mockResolvedValue({ data: mockTags });

      const result = await tagsApi.getTags();

      expect(apiClient.get).toHaveBeenCalledWith('/tags');
      expect(result).toEqual(mockTags);
      expect(result).toHaveLength(4);
    });

    it('should return empty array when no tags', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await tagsApi.getTags();

      expect(result).toEqual([]);
    });

    it('should handle fetch error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(tagsApi.getTags()).rejects.toThrow('Network error');
    });
  });
});
