import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Alert from '../Alert';


describe('Alert', () => {
  describe('rendering', () => {
    it('should render alert with children', () => {
      render(<Alert>Test message</Alert>);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Alert title="Alert Title">Content</Alert>);

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should have role="alert"', () => {
      render(<Alert>Test</Alert>);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Alert className="custom-class">Test</Alert>);

      expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });
  });

  describe('variants', () => {
    it('should render info variant by default', () => {
      render(<Alert>Info message</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-blue-50');
    });

    it('should render success variant', () => {
      render(<Alert variant="success">Success message</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-green-50');
    });

    it('should render error variant', () => {
      render(<Alert variant="error">Error message</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-50');
    });

    it('should render warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-yellow-50');
    });
  });

  describe('close button', () => {
    it('should show close button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<Alert onClose={onClose}>Closable alert</Alert>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should not show close button when onClose is not provided', () => {
      render(<Alert>Non-closable alert</Alert>);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Alert onClose={onClose}>Closable alert</Alert>);

      fireEvent.click(screen.getByRole('button'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
