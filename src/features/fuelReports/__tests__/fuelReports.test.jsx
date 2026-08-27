import { describe, it, expect, vi } from 'vitest';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useQueries: () => [],
  useMutation: () => ({ mutate: vi.fn() }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

// Mock react-i18next
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
}));


describe('FuelReportCard', () => {
  describe('module', () => {
    it('should export FuelReportCard component', async () => {
      const module = await import('../FuelReportCard');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('FuelReportsSection', () => {
  describe('module', () => {
    it('should export FuelReportsSection component', async () => {
      const module = await import('../FuelReportsSection');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});


describe('AddFuelReportForm', () => {
  describe('module', () => {
    it('should export AddFuelReportForm component', async () => {
      const module = await import('../AddFuelReportForm');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
