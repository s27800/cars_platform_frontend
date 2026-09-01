import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconButton from '../IconButton';


describe('IconButton', () => {
  const TestIcon = () => <span data-testid="test-icon">Icon</span>;

  describe('rendering', () => {
    it('should render button element', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should have aria-label', () => {
      render(<IconButton label="Close"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close');
    });

    it('should apply custom className', () => {
      render(<IconButton label="Test" className="custom-class"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should apply default variant', () => {
      render(<IconButton label="Test" variant="default"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('text-neutral-600');
    });

    it('should apply primary variant', () => {
      render(<IconButton label="Test" variant="primary"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('text-primary-600');
    });

    it('should apply danger variant', () => {
      render(<IconButton label="Test" variant="danger"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('text-red-600');
    });

    it('should apply ghost variant', () => {
      render(<IconButton label="Test" variant="ghost"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('text-neutral-500');
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('p-2');
    });

    it('should apply small size', () => {
      render(<IconButton label="Test" size="sm"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('p-1.5');
    });

    it('should apply large size', () => {
      render(<IconButton label="Test" size="lg"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('p-3');
    });
  });

  describe('interaction', () => {
    it('should call onClick when clicked', () => {
      const onClick = vi.fn();

      render(<IconButton label="Test" onClick={onClick}><TestIcon /></IconButton>);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();

      render(<IconButton label="Test" onClick={onClick} disabled><TestIcon /></IconButton>);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<IconButton label="Test" disabled><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled styling', () => {
      render(<IconButton label="Test" disabled><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
      expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('styling', () => {
    it('should have rounded-lg class', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('rounded-lg');
    });

    it('should have inline-flex class', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('inline-flex');
    });

    it('should have transition-colors class', () => {
      render(<IconButton label="Test"><TestIcon /></IconButton>);

      expect(screen.getByRole('button')).toHaveClass('transition-colors');
    });
  });

  describe('props spreading', () => {
    it('should pass additional props to button element', () => {
      render(<IconButton label="Test" data-testid="custom-button" type="submit"><TestIcon /></IconButton>);

      expect(screen.getByTestId('custom-button')).toHaveAttribute('type', 'submit');
    });
  });
});
