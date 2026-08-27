import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fuelReportsApi from '../fuelReports';
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


describe('fuelReports API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFuelReports', () => {
    it('should call GET /fuel-reports/{carId} with default params', async () => {
      const carId = 123;
      const mockResponse = {
        content: [
          { id: 1, consumption: 8.5, drivingStyle: 'MIXED' },
          { id: 2, consumption: 7.2, drivingStyle: 'HIGHWAY' },
        ],
        totalElements: 2,
        totalPages: 1,
      };
      
      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await fuelReportsApi.getFuelReports(carId);

      expect(apiClient.get).toHaveBeenCalledWith('/fuel-reports/123', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /fuel-reports/{carId} with pagination', async () => {
      const carId = 123;
      const params = { page: 0, size: 10 };
      
      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await fuelReportsApi.getFuelReports(carId, params);

      expect(apiClient.get).toHaveBeenCalledWith('/fuel-reports/123', { params });
    });

    it('should handle fetch error', async () => {
      apiClient.get.mockRejectedValue(new Error('Failed to fetch fuel reports'));

      await expect(fuelReportsApi.getFuelReports(123)).rejects.toThrow('Failed to fetch fuel reports');
    });
  });

  describe('getAverageConsumption', () => {
    it('should call GET /fuel-reports/{carId}/average-consumption', async () => {
      const carId = 123;
      const mockConsumption = {
        averageConsumption: 8.2,
        cityConsumption: 10.5,
        highwayConsumption: 6.8,
        mixedConsumption: 8.2,
        totalReports: 15,
      };
      
      apiClient.get.mockResolvedValue({ data: mockConsumption });

      const result = await fuelReportsApi.getAverageConsumption(carId);

      expect(apiClient.get).toHaveBeenCalledWith('/fuel-reports/123/average-consumption');
      expect(result).toEqual(mockConsumption);
    });

    it('should handle no reports', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await fuelReportsApi.getAverageConsumption(123);

      expect(result).toBeNull();
    });
  });

  describe('createFuelReport', () => {
    it('should call POST /fuel-reports/{carId} with report data', async () => {
      const carId = 123;
      const reportData = {
        consumption: 8.5,
        drivingStyle: 'MIXED',
        distance: 500,
        comment: 'Normal city driving',
      };
      
      const mockCreated = { id: 1, ...reportData, carId };
      
      apiClient.post.mockResolvedValue({ data: mockCreated });

      const result = await fuelReportsApi.createFuelReport(carId, reportData);

      expect(apiClient.post).toHaveBeenCalledWith('/fuel-reports/123', reportData);
      expect(result).toEqual(mockCreated);
    });

    it('should handle validation error', async () => {
      const carId = 123;
      const invalidData = { comment: 'No consumption provided' };
      
      apiClient.post.mockRejectedValue(new Error('Consumption is required'));

      await expect(fuelReportsApi.createFuelReport(carId, invalidData)).rejects.toThrow('Consumption is required');
    });

    it('should handle unauthorized error', async () => {
      apiClient.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(fuelReportsApi.createFuelReport(123, {})).rejects.toThrow('Unauthorized');
    });
  });
});
