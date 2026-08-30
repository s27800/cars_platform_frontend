import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


// Mock axios
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

vi.mock('../../utils/toastBus', () => ({
  showToast: {
    warning: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));


describe('apiClient', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('module exports', () => {
    it('should export default apiClient', async () => {
      vi.resetModules();
      const module = await import('../apiClient');
      expect(module.default).toBeDefined();
    });
  });

  describe('axios instance creation', () => {
    it('should create axios instance with correct config', async () => {
      vi.resetModules();
      await import('../apiClient');
      const axios = (await import('axios')).default;

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );
    });

    it('should register request interceptor', async () => {
      vi.resetModules();
      await import('../apiClient');
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should register response interceptor', async () => {
      vi.resetModules();
      await import('../apiClient');
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
