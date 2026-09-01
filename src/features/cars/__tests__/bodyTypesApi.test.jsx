import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as bodyTypesApi from '../bodyTypesApi';
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


describe('bodyTypes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBodyTypes', () => {
    it('should call GET /body-types', async () => {
      const mockBodyTypes = [
        { id: 1, name: 'Sedan' },
        { id: 2, name: 'SUV' },
        { id: 3, name: 'Hatchback' },
        { id: 4, name: 'Coupe' },
        { id: 5, name: 'Wagon' },
        { id: 6, name: 'Convertible' },
      ];

      apiClient.get.mockResolvedValue({ data: mockBodyTypes });

      const result = await bodyTypesApi.getBodyTypes();

      expect(apiClient.get).toHaveBeenCalledWith('/body-types');
      expect(result).toEqual(mockBodyTypes);
      expect(result).toHaveLength(6);
    });

    it('should return empty array when no body types', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await bodyTypesApi.getBodyTypes();

      expect(result).toEqual([]);
    });

    it('should handle fetch error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(bodyTypesApi.getBodyTypes()).rejects.toThrow('Network error');
    });
  });
});
