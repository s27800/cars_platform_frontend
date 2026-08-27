import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as carsApi from '../cars';
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


describe('cars API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCarById', () => {
    it('should call GET /cars/{id}', async () => {
      const carId = 123;
      const mockCar = {
        id: 123,
        name: 'BMW M3',
        brand: { id: 1, name: 'BMW' },
        model: { id: 1, name: 'M3' },
      };
      
      apiClient.get.mockResolvedValue({ data: mockCar });

      const result = await carsApi.getCarById(carId);

      expect(apiClient.get).toHaveBeenCalledWith('/cars/123');
      expect(result).toEqual(mockCar);
    });

    it('should handle car not found', async () => {
      apiClient.get.mockRejectedValue(new Error('Car not found'));

      await expect(carsApi.getCarById(999)).rejects.toThrow('Car not found');
    });
  });

  describe('searchCars', () => {
    it('should call GET /cars/search with default params', async () => {
      const mockResponse = {
        content: [{ id: 1, name: 'BMW M3' }],
        totalElements: 1,
        totalPages: 1,
      };
      
      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await carsApi.searchCars();

      expect(apiClient.get).toHaveBeenCalledWith('/cars/search', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /cars/search with search query', async () => {
      const params = { search: 'BMW' };
      const mockResponse = {
        content: [{ id: 1, name: 'BMW M3' }],
        totalElements: 1,
      };
      
      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await carsApi.searchCars(params);

      expect(apiClient.get).toHaveBeenCalledWith('/cars/search', { params });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /cars/search with filters', async () => {
      const params = {
        brandIds: [1, 2],
        minPower: 200,
        maxPower: 500,
        engineTypes: ['PETROL', 'DIESEL'],
        page: 0,
        size: 10,
      };
      
      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await carsApi.searchCars(params);

      expect(apiClient.get).toHaveBeenCalledWith('/cars/search', { params });
    });

    it('should call GET /cars/search with pagination', async () => {
      const params = { page: 2, size: 20, sort: 'name,asc' };
      
      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await carsApi.searchCars(params);

      expect(apiClient.get).toHaveBeenCalledWith('/cars/search', { params });
    });

    it('should handle search error', async () => {
      apiClient.get.mockRejectedValue(new Error('Search failed'));

      await expect(carsApi.searchCars({ search: 'test' })).rejects.toThrow('Search failed');
    });
  });
});
