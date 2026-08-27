import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as generationsApi from '../generations';
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


describe('generations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGenerationById', () => {
    it('should call GET /generations/{id}', async () => {
      const generationId = 1;
      const mockGeneration = {
        id: 1,
        name: 'G80',
        yearStart: 2021,
        yearEnd: null,
        model: { id: 1, name: 'M3' },
        brand: { id: 1, name: 'BMW' },
        cars: [
          { id: 1, name: 'M3 Competition' },
          { id: 2, name: 'M3 CS' },
        ],
      };
      
      apiClient.get.mockResolvedValue({ data: mockGeneration });

      const result = await generationsApi.getGenerationById(generationId);

      expect(apiClient.get).toHaveBeenCalledWith('/generations/1');
      expect(result).toEqual(mockGeneration);
      expect(result.cars).toHaveLength(2);
    });

    it('should handle generation not found', async () => {
      apiClient.get.mockRejectedValue(new Error('Generation not found'));

      await expect(generationsApi.getGenerationById(999)).rejects.toThrow('Generation not found');
    });
  });
});
