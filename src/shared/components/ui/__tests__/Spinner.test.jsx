import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../Spinner';


describe('Spinner', () => {
  describe('rendering', () => {
    it('should render spinner', () => {
      render(<Spinner />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Spinner className="custom-class" />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('custom-class');
    });

    it('should have rounded-full class', () => {
      render(<Spinner />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('rounded-full');
    });
  });

  describe('sizes', () => {
    it('should render medium size by default', () => {
      render(<Spinner />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('h-8');
      expect(spinner).toHaveClass('w-8');
    });

    it('should render small size', () => {
      render(<Spinner size="sm" />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('h-4');
      expect(spinner).toHaveClass('w-4');
    });

    it('should render large size', () => {
      render(<Spinner size="lg" />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('h-12');
      expect(spinner).toHaveClass('w-12');
    });
  });

  describe('styling', () => {
    it('should have border classes for spinner effect', () => {
      render(<Spinner />);

      const spinner = document.querySelector('.animate-spin');

      expect(spinner).toHaveClass('border-neutral-300');
      expect(spinner).toHaveClass('border-t-primary-600');
    });
  });
});
