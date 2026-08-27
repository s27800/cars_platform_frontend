import { describe, it, expect, vi } from 'vitest';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useQueries: () => [],
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


describe('SpecificationSection', () => {
  describe('module', () => {
    it('should export SpecificationSection component', async () => {
      const module = await import('../SpecificationSection');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});


describe('ImageGallery', () => {
  describe('module', () => {
    it('should export ImageGallery component', async () => {
      const module = await import('../ImageGallery');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
