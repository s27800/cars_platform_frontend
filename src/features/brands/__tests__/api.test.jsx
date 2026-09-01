import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as brandsApi from '../api';
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


describe('brands API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBrands', () => {
    it('should call GET /brands', async () => {
      const mockBrands = [
        { id: 1, name: 'BMW', logoUrl: '/logos/bmw.png' },
        { id: 2, name: 'Mercedes', logoUrl: '/logos/mercedes.png' },
        { id: 3, name: 'Audi', logoUrl: '/logos/audi.png' },
      ];

      apiClient.get.mockResolvedValue({ data: mockBrands });

      const result = await brandsApi.getBrands();

      expect(apiClient.get).toHaveBeenCalledWith('/brands');
      expect(result).toEqual(mockBrands);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no brands', async () => {
      apiClient.get.mockResolvedValue({ data: [] });

      const result = await brandsApi.getBrands();

      expect(result).toEqual([]);
    });

    it('should handle fetch error', async () => {
      apiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(brandsApi.getBrands()).rejects.toThrow('Network error');
    });
  });

  describe('getBrandById', () => {
    it('should call GET /brands/{id}', async () => {
      const brandId = 1;
      const mockBrand = {
        id: 1,
        name: 'BMW',
        logoUrl: '/logos/bmw.png',
        models: [
          { id: 1, name: 'M3' },
          { id: 2, name: 'M5' },
        ],
      };

      apiClient.get.mockResolvedValue({ data: mockBrand });

      const result = await brandsApi.getBrandById(brandId);

      expect(apiClient.get).toHaveBeenCalledWith('/brands/1');
      expect(result).toEqual(mockBrand);
      expect(result.models).toHaveLength(2);
    });

    it('should handle brand not found', async () => {
      apiClient.get.mockRejectedValue(new Error('Brand not found'));

      await expect(brandsApi.getBrandById(999)).rejects.toThrow('Brand not found');
    });
  });
});
