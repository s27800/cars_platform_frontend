import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userSettingsApi from '../userSettings';
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


describe('userSettings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should call GET /user-settings', async () => {
      const mockSettings = {
        theme: 'dark',
        language: 'en',
        notifications: true,
      };
      
      apiClient.get.mockResolvedValue({ data: mockSettings });

      const result = await userSettingsApi.getSettings();

      expect(apiClient.get).toHaveBeenCalledWith('/user-settings');
      expect(result).toEqual(mockSettings);
    });

    it('should handle unauthorized error', async () => {
      apiClient.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(userSettingsApi.getSettings()).rejects.toThrow('Unauthorized');
    });

    it('should return default settings when none exist', async () => {
      apiClient.get.mockResolvedValue({ data: null });

      const result = await userSettingsApi.getSettings();

      expect(result).toBeNull();
    });
  });

  describe('updateSettings', () => {
    it('should call PUT /user-settings with theme', async () => {
      const settingsData = { theme: 'dark' };
      const mockUpdated = { theme: 'dark', language: 'en' };
      
      apiClient.put.mockResolvedValue({ data: mockUpdated });

      const result = await userSettingsApi.updateSettings(settingsData);

      expect(apiClient.put).toHaveBeenCalledWith('/user-settings', settingsData);
      expect(result).toEqual(mockUpdated);
    });

    it('should call PUT /user-settings with language', async () => {
      const settingsData = { language: 'pl' };
      
      apiClient.put.mockResolvedValue({ data: { language: 'pl' } });

      const result = await userSettingsApi.updateSettings(settingsData);

      expect(apiClient.put).toHaveBeenCalledWith('/user-settings', settingsData);
      expect(result.language).toBe('pl');
    });

    it('should handle unauthorized error', async () => {
      apiClient.put.mockRejectedValue(new Error('Unauthorized'));

      await expect(userSettingsApi.updateSettings({ theme: 'dark' })).rejects.toThrow('Unauthorized');
    });
  });
});
