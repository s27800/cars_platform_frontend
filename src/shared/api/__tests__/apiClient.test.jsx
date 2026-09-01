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


vi.mock('../../../i18n', () => ({
  default: { t: vi.fn((key) => key) },
}));


const loadInterceptors = async () => {
  vi.resetModules();
  await import('../apiClient');

  const [onRequest, onRequestError] = mockAxiosInstance.interceptors.request.use.mock.calls.at(-1);
  const [onResponse, onResponseError] = mockAxiosInstance.interceptors.response.use.mock.calls.at(-1);

  return { onRequest, onRequestError, onResponse, onResponseError };
};

const httpError = (status, data = {}) => ({ response: { status, data } });


describe('apiClient', () => {
  let showToast;
  let originalLocation;

  beforeEach(async () => {
    vi.clearAllMocks();
    showToast = (await import('../../utils/toastBus')).showToast;
    originalLocation = window.location;
    delete window.location;
    window.location = { pathname: '/cars', href: '/cars' };
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.resetModules();
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


  describe('request interceptor', () => {
    it('should attach the stored token as a Bearer header', async () => {
      localStorage.getItem.mockReturnValue('stored-jwt');
      const { onRequest } = await loadInterceptors();

      const config = onRequest({ headers: {} });

      expect(config.headers.Authorization).toBe('Bearer stored-jwt');
    });

    it('should read the token from the token storage key', async () => {
      localStorage.getItem.mockReturnValue('stored-jwt');
      const { onRequest } = await loadInterceptors();

      onRequest({ headers: {} });

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should leave the headers untouched when there is no token', async () => {
      localStorage.getItem.mockReturnValue(null);
      const { onRequest } = await loadInterceptors();

      const config = onRequest({ headers: {} });

      expect(config.headers.Authorization).toBeUndefined();
    });

    it('should keep the rest of the config', async () => {
      localStorage.getItem.mockReturnValue('stored-jwt');
      const { onRequest } = await loadInterceptors();

      const config = onRequest({ url: '/cars', method: 'get', headers: {} });

      expect(config.url).toBe('/cars');
      expect(config.method).toBe('get');
    });

    it('should reject a request error unchanged', async () => {
      const { onRequestError } = await loadInterceptors();
      const error = new Error('request setup failed');

      await expect(onRequestError(error)).rejects.toBe(error);
    });
  });


  describe('response interceptor - success', () => {
    it('should pass a successful response through', async () => {
      const { onResponse } = await loadInterceptors();
      const response = { status: 200, data: { id: 1 } };

      expect(onResponse(response)).toBe(response);
    });

    it('should not raise a toast for a successful response', async () => {
      const { onResponse } = await loadInterceptors();

      onResponse({ status: 200, data: {} });

      expect(showToast.error).not.toHaveBeenCalled();
      expect(showToast.warning).not.toHaveBeenCalled();
    });
  });


  describe('response interceptor - network failures', () => {
    it('should report a network error when the request never got a response', async () => {
      const { onResponseError } = await loadInterceptors();
      const error = { request: {} };

      await expect(onResponseError(error)).rejects.toBe(error);
      expect(showToast.error).toHaveBeenCalledWith('common:errors.networkError');
    });

    it('should stay silent when the request was never sent', async () => {
      const { onResponseError } = await loadInterceptors();
      const error = new Error('cancelled before sending');

      await expect(onResponseError(error)).rejects.toBe(error);
      expect(showToast.error).not.toHaveBeenCalled();
    });
  });


  describe('response interceptor - 401 unauthorized', () => {
    it('should clear the stored session', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(401))).rejects.toBeDefined();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('tokenExpiry');
    });

    it('should warn about the expired session and redirect to login', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(401))).rejects.toBeDefined();

      expect(showToast.warning).toHaveBeenCalledWith('common:session.expired');
      expect(window.location.href).toBe('/login');
    });

    it('should not bounce the user off the login page', async () => {
      window.location = { pathname: '/login', href: '/login' };
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(401))).rejects.toBeDefined();

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(showToast.warning).not.toHaveBeenCalled();
      expect(window.location.href).toBe('/login');
    });
  });


  describe('response interceptor - other statuses', () => {
    it('should report 403 as access denied', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(403))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('common:session.accessDenied');
    });

    it('should report 404 with the server message when there is one', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(404, { message: 'Car not found' }))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('Car not found');
    });

    it('should fall back to a generic message for a 404 without one', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(404))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('common:session.notFound');
    });

    it('should warn on 400 with the server message', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(400, { message: 'Invalid year' }))).rejects.toBeDefined();

      expect(showToast.warning).toHaveBeenCalledWith('Invalid year');
    });

    it('should warn on 409 with the server message', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(409, { message: 'Already reviewed' }))).rejects.toBeDefined();

      expect(showToast.warning).toHaveBeenCalledWith('Already reviewed');
    });

    it('should hide the body of a 500 behind a generic message', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(500, { message: 'NullPointerException at row 42' }))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('common:session.serverError');
    });

    it('should report an unhandled status with the server message', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(418, { message: 'I am a teapot' }))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('I am a teapot');
    });

    it('should fall back to a generic message for an unhandled status', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(503))).rejects.toBeDefined();

      expect(showToast.error).toHaveBeenCalledWith('common:session.unexpected');
    });

    it('should accept an error field instead of a message field', async () => {
      const { onResponseError } = await loadInterceptors();

      await expect(onResponseError(httpError(400, { error: 'Bad payload' }))).rejects.toBeDefined();

      expect(showToast.warning).toHaveBeenCalledWith('Bad payload');
    });

    it('should always reject so the caller can still handle the failure', async () => {
      const { onResponseError } = await loadInterceptors();
      const error = httpError(403);

      await expect(onResponseError(error)).rejects.toBe(error);
    });
  });
});
