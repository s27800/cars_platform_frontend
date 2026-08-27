import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavLink from '../NavLink';


// Wrapper component for Router context
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('NavLink', () => {
  describe('rendering', () => {
    it('should render link element', () => {
      renderWithRouter(<NavLink to="/test">Test Link</NavLink>);
      
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should render children', () => {
      renderWithRouter(<NavLink to="/test">Link Text</NavLink>);
      
      expect(screen.getByText('Link Text')).toBeInTheDocument();
    });

    it('should have correct href', () => {
      renderWithRouter(<NavLink to="/dashboard">Dashboard</NavLink>);
      
      expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
    });

    it('should apply custom className', () => {
      renderWithRouter(<NavLink to="/test" className="custom-class">Link</NavLink>);
      
      expect(screen.getByRole('link')).toHaveClass('custom-class');
    });
  });

  describe('active state', () => {
    it('should not have active styling when isActive is false', () => {
      renderWithRouter(<NavLink to="/test" isActive={false}>Link</NavLink>);
      
      const link = screen.getByRole('link');
      expect(link).not.toHaveClass('bg-primary-50');
      expect(link).toHaveClass('text-neutral-600');
    });

    it('should have active styling when isActive is true', () => {
      renderWithRouter(<NavLink to="/test" isActive={true}>Link</NavLink>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-primary-50');
      expect(link).toHaveClass('text-primary-600');
    });
  });

  describe('variants', () => {
    describe('default variant', () => {
      it('should apply default variant styling', () => {
        renderWithRouter(<NavLink to="/test" variant="default">Link</NavLink>);
        
        const link = screen.getByRole('link');
        expect(link).toHaveClass('px-4');
        expect(link).toHaveClass('py-2');
        expect(link).toHaveClass('text-sm');
      });

      it('should have hover styling for inactive state', () => {
        renderWithRouter(<NavLink to="/test" variant="default" isActive={false}>Link</NavLink>);
        
        expect(screen.getByRole('link')).toHaveClass('hover:bg-neutral-100');
      });
    });

    describe('mobile variant', () => {
      it('should apply mobile variant styling', () => {
        renderWithRouter(<NavLink to="/test" variant="mobile">Link</NavLink>);
        
        const link = screen.getByRole('link');
        expect(link).toHaveClass('block');
        expect(link).toHaveClass('py-3');
        expect(link).toHaveClass('text-base');
        expect(link).toHaveClass('rounded-xl');
      });

      it('should have active styling for mobile variant', () => {
        renderWithRouter(<NavLink to="/test" variant="mobile" isActive={true}>Link</NavLink>);
        
        const link = screen.getByRole('link');
        expect(link).toHaveClass('bg-primary-50');
        expect(link).toHaveClass('text-primary-600');
      });
    });
  });

  describe('props spreading', () => {
    it('should pass additional props to Link', () => {
      renderWithRouter(<NavLink to="/test" data-testid="nav-link" target="_blank">Link</NavLink>);
      
      const link = screen.getByTestId('nav-link');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
