import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as modelsApi from '../modelsApi';
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


describe('models API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getModelById', () => {
    it('should call GET /models/{id}', async () => {
      const modelId = 1;
      const mockModel = {
        id: 1,
        name: 'M3',
        brand: { id: 1, name: 'BMW' },
        generations: [
          { id: 1, name: 'E46' },
          { id: 2, name: 'E90' },
          { id: 3, name: 'F80' },
          { id: 4, name: 'G80' },
        ],
      };

      apiClient.get.mockResolvedValue({ data: mockModel });

      const result = await modelsApi.getModelById(modelId);

      expect(apiClient.get).toHaveBeenCalledWith('/models/1');
      expect(result).toEqual(mockModel);
      expect(result.generations).toHaveLength(4);
    });

    it('should handle model not found', async () => {
      apiClient.get.mockRejectedValue(new Error('Model not found'));

      await expect(modelsApi.getModelById(999)).rejects.toThrow('Model not found');
    });
  });
});
