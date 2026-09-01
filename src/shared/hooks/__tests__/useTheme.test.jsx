import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useTheme from '../useTheme';
import { ThemeContext } from '../../contexts/ThemeContext';


const createWrapper = (value) => {
  return ({ children }) => (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};


describe('useTheme', () => {
  describe('context access', () => {
    it('should return context value when used within provider', () => {
      const mockValue = {
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        isDark: false,
        isLoading: false,
        isSyncing: false,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current).toEqual(mockValue);
    });

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('returned values', () => {
    it('should return current theme', () => {
      const mockValue = {
        theme: 'dark',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        isDark: true,
        isLoading: false,
        isSyncing: false,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should return setTheme function', () => {
      const setThemeMock = vi.fn();
      const mockValue = {
        theme: 'light',
        setTheme: setThemeMock,
        toggleTheme: vi.fn(),
        isDark: false,
        isLoading: false,
        isSyncing: false,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.setTheme('dark');
      expect(setThemeMock).toHaveBeenCalledWith('dark');
    });

    it('should return toggleTheme function', () => {
      const toggleThemeMock = vi.fn();
      const mockValue = {
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: toggleThemeMock,
        isDark: false,
        isLoading: false,
        isSyncing: false,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.toggleTheme();
      expect(toggleThemeMock).toHaveBeenCalled();
    });

    it('should return isDark boolean', () => {
      const mockValue = {
        theme: 'dark',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        isDark: true,
        isLoading: false,
        isSyncing: false,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.isDark).toBe(true);
    });

    it('should return loading states', () => {
      const mockValue = {
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        isDark: false,
        isLoading: true,
        isSyncing: true,
        THEMES: { LIGHT: 'light', DARK: 'dark' },
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSyncing).toBe(true);
    });

    it('should return THEMES constants', () => {
      const THEMES = { LIGHT: 'light', DARK: 'dark' };
      const mockValue = {
        theme: 'light',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        isDark: false,
        isLoading: false,
        isSyncing: false,
        THEMES,
      };

      const { result } = renderHook(() => useTheme(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.THEMES).toEqual(THEMES);
    });
  });
});
