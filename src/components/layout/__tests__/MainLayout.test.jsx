import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../MainLayout';


// Mock Header and Footer
vi.mock('../Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('../Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));


// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('MainLayout', () => {
  describe('structure', () => {
    it('should render Header component', () => {
      renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render main element', () => {
      renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render children content', () => {
      renderWithRouter(
        <MainLayout>
          <div>Child Content</div>
        </MainLayout>
      );
      
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on main element', () => {
      renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Main content');
    });
  });

  describe('with Outlet', () => {
    it('should render Outlet when no children provided', () => {
      render(
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="test" element={<div>Outlet Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      
      expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have minimum screen height', () => {
      const { container } = renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(container.firstChild).toHaveClass('min-h-screen');
    });

    it('should have flex column layout', () => {
      const { container } = renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(container.firstChild).toHaveClass('flex');
      expect(container.firstChild).toHaveClass('flex-col');
    });

    it('should have flex-grow on main', () => {
      renderWithRouter(<MainLayout><div>Content</div></MainLayout>);
      
      expect(screen.getByRole('main')).toHaveClass('flex-grow');
    });
  });
});
