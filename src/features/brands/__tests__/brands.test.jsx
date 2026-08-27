import { describe, it, expect, vi } from 'vitest';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
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


describe('ModelsGrid', () => {
  describe('module', () => {
    it('should export ModelsGrid component', async () => {
      const module = await import('../ModelsGrid');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
