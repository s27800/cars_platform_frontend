import { describe, it, expect } from 'vitest';


describe('queryClient', () => {
  describe('module', () => {
    it('should export queryClient as default', async () => {
      const module = await import('../queryClient');

      expect(module.default).toBeDefined();
    });

    it('should be a QueryClient instance', async () => {
      const queryClient = (await import('../queryClient')).default;

      expect(queryClient).toBeDefined();
      expect(typeof queryClient.getQueryData).toBe('function');
      expect(typeof queryClient.setQueryData).toBe('function');
      expect(typeof queryClient.invalidateQueries).toBe('function');
    });
  });

  describe('default options', () => {
    it('should have staleTime of 5 minutes', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();

      expect(options.queries.staleTime).toBe(1000 * 60 * 5);
    });

    it('should have gcTime of 30 minutes', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();

      expect(options.queries.gcTime).toBe(1000 * 60 * 30);
    });

    it('should disable refetchOnWindowFocus', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();

      expect(options.queries.refetchOnWindowFocus).toBe(false);
    });

    it('should enable refetchOnReconnect', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();

      expect(options.queries.refetchOnReconnect).toBe(true);
    });

    it('should disable mutation retries', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();

      expect(options.mutations.retry).toBe(false);
    });
  });

  describe('retry logic', () => {
    it('should not retry on 4xx client errors', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();
      const retryFn = options.queries.retry;

      expect(retryFn(1, { response: { status: 400 } })).toBe(false); // 400 Bad Request
      expect(retryFn(1, { response: { status: 401 } })).toBe(false); // 401 Unauthorized
      expect(retryFn(1, { response: { status: 403 } })).toBe(false); // 403 Forbidden
      expect(retryFn(1, { response: { status: 404 } })).toBe(false); // 404 Not Found
      expect(retryFn(1, { response: { status: 422 } })).toBe(false); // 422 Unprocessable Entity
    });

    it('should retry on 5xx server errors up to 3 times', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();
      const retryFn = options.queries.retry;

      const serverError = { response: { status: 500 } };

      expect(retryFn(0, serverError)).toBe(true);
      expect(retryFn(1, serverError)).toBe(true);
      expect(retryFn(2, serverError)).toBe(true);
      expect(retryFn(3, serverError)).toBe(false);
    });

    it('should retry on network errors', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();
      const retryFn = options.queries.retry;
      const networkError = { message: 'Network Error' };

      expect(retryFn(0, networkError)).toBe(true);
      expect(retryFn(1, networkError)).toBe(true);
      expect(retryFn(2, networkError)).toBe(true);
      expect(retryFn(3, networkError)).toBe(false);
    });
  });

  describe('retryDelay', () => {
    it('should use exponential backoff', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();
      const retryDelayFn = options.queries.retryDelay;

      expect(retryDelayFn(0)).toBe(1000); // 1000ms
      expect(retryDelayFn(1)).toBe(2000); // 2000ms
      expect(retryDelayFn(2)).toBe(4000); // 4000ms
      expect(retryDelayFn(3)).toBe(8000); // 8000ms
    });

    it('should cap delay at 30 seconds', async () => {
      const queryClient = (await import('../queryClient')).default;
      const options = queryClient.getDefaultOptions();
      const retryDelayFn = options.queries.retryDelay;

      expect(retryDelayFn(5)).toBe(30000); // 30000ms
      expect(retryDelayFn(10)).toBe(30000); // 30000ms
    });
  });

  describe('query cache operations', () => {
    it('should be able to set and get query data', async () => {
      const queryClient = (await import('../queryClient')).default;

      queryClient.setQueryData(['test', 'key'], { value: 'test data' });
      const data = queryClient.getQueryData(['test', 'key']);

      expect(data).toEqual({ value: 'test data' });

      // Cleanup
      queryClient.removeQueries({ queryKey: ['test', 'key'] });
    });

    it('should be able to invalidate queries', async () => {
      const queryClient = (await import('../queryClient')).default;

      queryClient.setQueryData(['invalidate', 'test'], { value: 'data' });

      await queryClient.invalidateQueries({ queryKey: ['invalidate', 'test'] });

      const state = queryClient.getQueryState(['invalidate', 'test']);
      expect(state?.isInvalidated).toBe(true);

      // Cleanup
      queryClient.removeQueries({ queryKey: ['invalidate', 'test'] });
    });
  });
});
