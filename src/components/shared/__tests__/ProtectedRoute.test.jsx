import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';


// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../hooks', () => ({
  useAuth: () => mockUseAuth(),
}));


// Helper to render with router
const renderWithRouter = (ui, { initialEntries = ['/protected'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};


describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show loading spinner when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: true,
      });

      const { container } = renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('unauthenticated user', () => {
    it('should redirect to login when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated user', () => {
    it('should render children when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to home when requireAdmin is true and user is not admin', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false,
      });

      renderWithRouter(
        <ProtectedRoute requireAdmin={true}>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should render children when requireAdmin is true and user is admin', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      renderWithRouter(
        <ProtectedRoute requireAdmin={true}>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });
});
