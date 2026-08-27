import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useToast from '../useToast';
import { ToastContext } from '../../contexts/ToastContext';


const createWrapper = (value) => {
  return ({ children }) => (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};


describe('useToast', () => {
  describe('context access', () => {
    it('should return context value when used within provider', () => {
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current).toEqual(mockValue);
    });

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('returned values', () => {
    it('should return toasts array', () => {
      const toasts = [
        { id: 1, message: 'Test toast', variant: 'success' },
        { id: 2, message: 'Another toast', variant: 'error' },
      ];
      const mockValue = {
        toasts,
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      expect(result.current.toasts).toEqual(toasts);
    });

    it('should return addToast function', () => {
      const addToastMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: addToastMock,
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.addToast({ message: 'Test', variant: 'info' });
      expect(addToastMock).toHaveBeenCalledWith({ message: 'Test', variant: 'info' });
    });

    it('should return removeToast function', () => {
      const removeToastMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: removeToastMock,
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.removeToast(1);
      expect(removeToastMock).toHaveBeenCalledWith(1);
    });

    it('should return success convenience method', () => {
      const successMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: successMock,
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.success('Success message');
      expect(successMock).toHaveBeenCalledWith('Success message');
    });

    it('should return error convenience method', () => {
      const errorMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: errorMock,
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.error('Error message');
      expect(errorMock).toHaveBeenCalledWith('Error message');
    });

    it('should return warning convenience method', () => {
      const warningMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: warningMock,
        info: vi.fn(),
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.warning('Warning message');
      expect(warningMock).toHaveBeenCalledWith('Warning message');
    });

    it('should return info convenience method', () => {
      const infoMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: infoMock,
        clearAll: vi.fn(),
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.info('Info message');
      expect(infoMock).toHaveBeenCalledWith('Info message');
    });

    it('should return clearAll function', () => {
      const clearAllMock = vi.fn();
      const mockValue = {
        toasts: [],
        addToast: vi.fn(),
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: clearAllMock,
      };

      const { result } = renderHook(() => useToast(), {
        wrapper: createWrapper(mockValue),
      });

      result.current.clearAll();
      expect(clearAllMock).toHaveBeenCalled();
    });
  });
});
