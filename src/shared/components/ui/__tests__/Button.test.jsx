import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../Button';


const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('Button', () => {

  // ==================== Basic Rendering ====================
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as button by default', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  // ==================== Click Handling ====================
  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} loading>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ==================== Disabled State ====================
  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
    });
  });

  // ==================== Loading State ====================
  describe('loading state', () => {
    it('should show spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should hide the left icon while loading', () => {
      render(<Button loading leftIcon={<span data-testid="left-icon" />}>Loading</Button>);
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    });

    it('should still show children when loading', () => {
      render(<Button loading>Loading Text</Button>);
      expect(screen.getByText('Loading Text')).toBeInTheDocument();
    });
  });

  // ==================== Variants ====================
  describe('variants', () => {
    it('should apply primary variant by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-600');
    });

    it('should apply secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-neutral-100');
    });

    it('should apply outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('should apply ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-neutral-100');
    });

    it('should apply danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });
  });

  // ==================== Sizes ====================
  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('py-2');
    });

    it('should apply small size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('py-1.5');
    });

    it('should apply large size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('py-3');
    });
  });

  // ==================== Full Width ====================
  describe('fullWidth', () => {
    it('should not be full width by default', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).not.toHaveClass('w-full');
    });

    it('should be full width when prop is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  // ==================== Icons ====================
  describe('icons', () => {
    it('should render left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      render(<Button leftIcon={<LeftIcon />}>With Icon</Button>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      render(<Button rightIcon={<RightIcon />}>With Icon</Button>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should not render left icon when loading', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      render(<Button leftIcon={<LeftIcon />} loading>Loading</Button>);
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    });

    it('should not render right icon when loading', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      render(<Button rightIcon={<RightIcon />} loading>Loading</Button>);
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  // ==================== Link Rendering ====================
  describe('link rendering', () => {
    it('should render as Link when "to" prop is provided', () => {
      renderWithRouter(<Button to="/test">Link Button</Button>);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should render as anchor when "href" prop is provided', () => {
      render(<Button href="https://example.com">External Link</Button>);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });

  // ==================== Ref Forwarding ====================
  describe('ref forwarding', () => {
    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Test</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });
});
