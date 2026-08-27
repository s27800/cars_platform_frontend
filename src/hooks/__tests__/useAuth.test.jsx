import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useAuth from '../useAuth';
import { AuthContext } from '../../contexts/AuthContext';


describe('useAuth', () => {
  const mockAuthValue = {
    user: { id: 1, username: 'testuser', role: 'USER' },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  const createWrapper = (value) => ({ children }) => (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  it('should return auth context value', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockAuthValue),
    });

    expect(result.current.user).toEqual(mockAuthValue.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should throw error when used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider.');

    consoleSpy.mockRestore();
  });

  it('should provide login function', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockAuthValue),
    });

    expect(typeof result.current.login).toBe('function');
  });

  it('should provide logout function', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockAuthValue),
    });

    expect(typeof result.current.logout).toBe('function');
  });

  it('should handle unauthenticated state', () => {
    const unauthenticatedValue = {
      ...mockAuthValue,
      user: null,
      isAuthenticated: false,
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(unauthenticatedValue),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
