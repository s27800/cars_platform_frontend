import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as dataProposalsApi from '../api';
import apiClient from '../../../shared/api/apiClient';


// Mock apiClient
vi.mock('../../../shared/api/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));


describe('dataProposals API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProposal', () => {
    it('should call POST /data-proposals/{carId}', async () => {
      const carId = 123;
      const proposalData = {
        category: 'ENGINE',
        currentValue: '200 HP',
        proposedValue: '210 HP',
        comment: 'Updated based on official specs',
      };

      const mockCreated = { id: 1, ...proposalData, status: 'PENDING' };

      apiClient.post.mockResolvedValue({ data: mockCreated });

      const result = await dataProposalsApi.createProposal(carId, proposalData);

      expect(apiClient.post).toHaveBeenCalledWith('/data-proposals/123', proposalData);
      expect(result).toEqual(mockCreated);
    });

    it('should handle unauthorized error', async () => {
      apiClient.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(dataProposalsApi.createProposal(123, {})).rejects.toThrow('Unauthorized');
    });
  });

  describe('getPendingProposals', () => {
    it('should call GET /data-proposals/pending with default params', async () => {
      const mockResponse = {
        content: [
          { id: 1, category: 'ENGINE', status: 'PENDING' },
          { id: 2, category: 'BODY', status: 'PENDING' },
        ],
        totalElements: 2,
      };

      apiClient.get.mockResolvedValue({ data: mockResponse });

      const result = await dataProposalsApi.getPendingProposals();

      expect(apiClient.get).toHaveBeenCalledWith('/data-proposals/pending', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /data-proposals/pending with pagination', async () => {
      const params = { page: 0, size: 10 };

      apiClient.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });

      await dataProposalsApi.getPendingProposals(params);

      expect(apiClient.get).toHaveBeenCalledWith('/data-proposals/pending', { params });
    });

    it('should handle forbidden error for non-admin', async () => {
      apiClient.get.mockRejectedValue(new Error('Access denied'));

      await expect(dataProposalsApi.getPendingProposals()).rejects.toThrow('Access denied');
    });
  });

  describe('resolveProposal', () => {
    it('should call PATCH /data-proposals/{id}/resolve to approve', async () => {
      const proposalId = 1;
      const mockResolved = { id: 1, status: 'APPROVED' };

      apiClient.patch.mockResolvedValue({ data: mockResolved });

      const result = await dataProposalsApi.resolveProposal(proposalId, true);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/data-proposals/1/resolve',
        null,
        { params: { approve: true } }
      );

      expect(result.status).toBe('APPROVED');
    });

    it('should call PATCH /data-proposals/{id}/resolve to reject with comment', async () => {
      const proposalId = 1;
      const adminComment = 'Insufficient evidence';
      const mockResolved = { id: 1, status: 'REJECTED', adminComment };

      apiClient.patch.mockResolvedValue({ data: mockResolved });

      const result = await dataProposalsApi.resolveProposal(proposalId, false, adminComment);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/data-proposals/1/resolve',
        null,
        { params: { approve: false, adminComment } }
      );

      expect(result.status).toBe('REJECTED');
    });

    it('should handle forbidden error for non-admin', async () => {
      apiClient.patch.mockRejectedValue(new Error('Access denied'));

      await expect(dataProposalsApi.resolveProposal(1, true)).rejects.toThrow('Access denied');
    });

    it('should handle not found error', async () => {
      apiClient.patch.mockRejectedValue(new Error('Proposal not found'));

      await expect(dataProposalsApi.resolveProposal(999, true)).rejects.toThrow('Proposal not found');
    });
  });
});
