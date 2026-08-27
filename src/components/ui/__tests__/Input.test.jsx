import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';


describe('Input', () => {

  // ==================== Basic Rendering ====================
  describe('rendering', () => {
    it('should render input element', () => {
      render(<Input name="test" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input name="email" label="Email Address" />);
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('should use name as id when id is not provided', () => {
      render(<Input name="username" label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('should use custom id when provided', () => {
      render(<Input name="username" id="custom-id" label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  // ==================== Value and Change ====================
  describe('value and change', () => {
    it('should handle value change', () => {
      const handleChange = vi.fn();
      render(<Input name="test" onChange={handleChange} />);
      
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'new value' } 
      });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      render(<Input name="test" value="controlled value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('controlled value');
    });

    it('should pass placeholder', () => {
      render(<Input name="test" placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  // ==================== Error State ====================
  describe('error state', () => {
    it('should display error message', () => {
      render(<Input name="test" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Input name="test" error="Error" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });

    it('should not show hint when error is present', () => {
      render(<Input name="test" error="Error" hint="Helpful hint" />);
      expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
    });
  });

  // ==================== Hint ====================
  describe('hint', () => {
    it('should display hint text', () => {
      render(<Input name="test" hint="This is a helpful hint" />);
      expect(screen.getByText('This is a helpful hint')).toBeInTheDocument();
    });

    it('should not display hint when error is present', () => {
      render(<Input name="test" hint="Hint" error="Error" />);
      expect(screen.queryByText('Hint')).not.toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  // ==================== Icons ====================
  describe('icons', () => {
    it('should render left icon', () => {
      const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
      render(<Input name="test" leftIcon={<LeftIcon />} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const RightIcon = () => <span data-testid="right-icon">✓</span>;
      render(<Input name="test" rightIcon={<RightIcon />} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should add padding for left icon', () => {
      const LeftIcon = () => <span>🔍</span>;
      render(<Input name="test" leftIcon={<LeftIcon />} />);
      expect(screen.getByRole('textbox')).toHaveClass('pl-10');
    });

    it('should add padding for right icon', () => {
      const RightIcon = () => <span>✓</span>;
      render(<Input name="test" rightIcon={<RightIcon />} />);
      expect(screen.getByRole('textbox')).toHaveClass('pr-10');
    });
  });

  // ==================== Sizes ====================
  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Input name="test" />);
      expect(screen.getByRole('textbox')).toHaveClass('py-2');
    });

    it('should apply small size', () => {
      render(<Input name="test" size="sm" />);
      expect(screen.getByRole('textbox')).toHaveClass('py-1.5');
    });

    it('should apply large size', () => {
      render(<Input name="test" size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('py-3');
    });
  });

  // ==================== Full Width ====================
  describe('fullWidth', () => {
    it('should be full width by default', () => {
      const { container } = render(<Input name="test" />);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('should not be full width when prop is false', () => {
      const { container } = render(<Input name="test" fullWidth={false} />);
      expect(container.firstChild).not.toHaveClass('w-full');
    });
  });

  // ==================== Ref Forwarding ====================
  describe('ref forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn();
      render(<Input name="test" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('should allow focus via ref', () => {
      const ref = { current: null };
      render(<Input name="test" ref={ref} />);
      
      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  // ==================== Input Types ====================
  describe('input types', () => {
    it('should support email type', () => {
      render(<Input name="email" type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should support number type', () => {
      render(<Input name="age" type="number" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });
});
