import { describe, it, expect, vi } from 'vitest';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useQueries: () => [],
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

// Mock react-i18next with all required exports
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// Mock hooks
vi.mock('../../../hooks', () => ({
  useAuth: () => ({ isAuthenticated: false }),
  useToast: () => ({ addToast: vi.fn() }),
}));


describe('ReviewCard', () => {
  describe('module', () => {
    it('should export ReviewCard component', async () => {
      const module = await import('../ReviewCard');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('ReviewsSection', () => {
  describe('module', () => {
    it('should export ReviewsSection component', async () => {
      const module = await import('../ReviewsSection');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('RatingsChart', () => {
  describe('module', () => {
    it('should export RatingsChart component', async () => {
      const module = await import('../RatingsChart');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('AddReviewForm', () => {
  describe('module', () => {
    it('should export AddReviewForm component', async () => {
      const module = await import('../AddReviewForm');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
