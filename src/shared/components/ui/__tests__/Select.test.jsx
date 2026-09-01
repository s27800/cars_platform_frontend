import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from '../Select';


describe('Select', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('rendering', () => {
    it('should render select element', () => {
      render(<Select options={defaultOptions} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Select label="Select Option" options={defaultOptions} />);

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should render all options', () => {
      render(<Select options={defaultOptions} />);

      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    it('should render placeholder option', () => {
      render(<Select options={defaultOptions} placeholder="Choose..." />);

      expect(screen.getByRole('option', { name: 'Choose...' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Select options={defaultOptions} className="custom-class" />);

      expect(screen.getByRole('combobox')).toHaveClass('custom-class');
    });
  });

  describe('value handling', () => {
    it('should select value when changed', () => {
      const onChange = vi.fn();
      render(<Select options={defaultOptions} onChange={onChange} />);

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option2' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      render(<Select options={defaultOptions} value="option2" onChange={() => {}} />);

      expect(screen.getByRole('combobox')).toHaveValue('option2');
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Select options={defaultOptions} />);

      expect(screen.getByRole('combobox')).toHaveClass('text-sm');
    });

    it('should apply small size', () => {
      render(<Select options={defaultOptions} size="sm" />);

      expect(screen.getByRole('combobox')).toHaveClass('text-sm');
    });

    it('should apply large size', () => {
      render(<Select options={defaultOptions} size="lg" />);

      expect(screen.getByRole('combobox')).toHaveClass('text-base');
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      render(<Select options={defaultOptions} error="Please select an option" />);

      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Select options={defaultOptions} error="Error" />);

      expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
    });
  });

  describe('hint', () => {
    it('should display hint text', () => {
      render(<Select options={defaultOptions} hint="Select your preference" />);

      expect(screen.getByText('Select your preference')).toBeInTheDocument();
    });

    it('should not show hint when error is present', () => {
      render(<Select options={defaultOptions} hint="Hint text" error="Error text" />);

      expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Select options={defaultOptions} disabled />);

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('should have disabled styling', () => {
      render(<Select options={defaultOptions} disabled />);

      expect(screen.getByRole('combobox')).toHaveClass('opacity-50');
      expect(screen.getByRole('combobox')).toHaveClass('cursor-not-allowed');
    });
  });

  describe('fullWidth', () => {
    it('should be full width by default', () => {
      const { container } = render(<Select options={defaultOptions} />);

      expect(container.firstChild).toHaveClass('w-full');
    });

    it('should not be full width when fullWidth is false', () => {
      const { container } = render(<Select options={defaultOptions} fullWidth={false} />);

      expect(container.firstChild).not.toHaveClass('w-full');
    });
  });

  describe('id and label association', () => {
    it('should use provided id', () => {
      render(<Select id="custom-id" label="Label" options={defaultOptions} />);

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-id');
    });

    it('should use name as id if no id provided', () => {
      render(<Select name="country" label="Label" options={defaultOptions} />);

      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'country');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to select element', () => {
      const ref = vi.fn();
      render(<Select ref={ref} options={defaultOptions} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSelectElement);
    });
  });
});
