import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useLanguage from '../useLanguage';
import { LanguageContext } from '../../contexts';


const createWrapper = (value) => {
  return ({ children }) => (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


describe('useLanguage', () => {
  describe('context access', () => {
    it('should return context value when used within provider', () => {
      const mockValue = {
        language: 'en',
        changeLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
        availableLanguages: [{ code: 'en', name: 'English' }],
        isLoading: false,
        isSyncing: false,
        LANGUAGES: { EN: 'en', PL: 'pl' },
        LANGUAGE_NAMES: { en: 'English', pl: 'Polski' },
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current).toEqual(mockValue);
    });

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('returned values', () => {
    it('should return language property', () => {
      const mockValue = {
        language: 'pl',
        changeLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
        availableLanguages: [],
        isLoading: false,
        isSyncing: false,
        LANGUAGES: {},
        LANGUAGE_NAMES: {},
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.language).toBe('pl');
    });

    it('should return changeLanguage function', () => {
      const changeLanguageMock = vi.fn();
      const mockValue = {
        language: 'en',
        changeLanguage: changeLanguageMock,
        toggleLanguage: vi.fn(),
        availableLanguages: [],
        isLoading: false,
        isSyncing: false,
        LANGUAGES: {},
        LANGUAGE_NAMES: {},
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.changeLanguage('pl');
      expect(changeLanguageMock).toHaveBeenCalledWith('pl');
    });

    it('should return toggleLanguage function', () => {
      const toggleLanguageMock = vi.fn();
      const mockValue = {
        language: 'en',
        changeLanguage: vi.fn(),
        toggleLanguage: toggleLanguageMock,
        availableLanguages: [],
        isLoading: false,
        isSyncing: false,
        LANGUAGES: {},
        LANGUAGE_NAMES: {},
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.toggleLanguage();
      expect(toggleLanguageMock).toHaveBeenCalled();
    });

    it('should return loading states', () => {
      const mockValue = {
        language: 'en',
        changeLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
        availableLanguages: [],
        isLoading: true,
        isSyncing: true,
        LANGUAGES: {},
        LANGUAGE_NAMES: {},
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSyncing).toBe(true);
    });

    it('should return available languages list', () => {
      const availableLanguages = [
        { code: 'en', name: 'English' },
        { code: 'pl', name: 'Polski' },
      ];
      const mockValue = {
        language: 'en',
        changeLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
        availableLanguages,
        isLoading: false,
        isSyncing: false,
        LANGUAGES: {},
        LANGUAGE_NAMES: {},
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.availableLanguages).toEqual(availableLanguages);
    });

    it('should return language constants', () => {
      const LANGUAGES = { EN: 'en', PL: 'pl' };
      const LANGUAGE_NAMES = { en: 'English', pl: 'Polski' };
      const mockValue = {
        language: 'en',
        changeLanguage: vi.fn(),
        toggleLanguage: vi.fn(),
        availableLanguages: [],
        isLoading: false,
        isSyncing: false,
        LANGUAGES,
        LANGUAGE_NAMES,
      };

      const { result } = renderHook(() => useLanguage(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.LANGUAGES).toEqual(LANGUAGES);
      expect(result.current.LANGUAGE_NAMES).toEqual(LANGUAGE_NAMES);
    });
  });
});
