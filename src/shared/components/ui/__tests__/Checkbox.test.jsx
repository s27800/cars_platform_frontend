import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Checkbox from '../Checkbox';


describe('Checkbox', () => {
  describe('rendering', () => {
    it('should render checkbox input', () => {
      render(<Checkbox />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Checkbox label="Accept terms" />);

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Checkbox className="custom-class" />);

      const wrapper = screen.getByRole('checkbox').closest('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('should be unchecked by default', () => {
      render(<Checkbox />);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should be checked when checked prop is true', () => {
      render(<Checkbox checked={true} onChange={() => {}} />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should call onChange when clicked', () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('id handling', () => {
    it('should use provided id', () => {
      render(<Checkbox id="custom-id" label="Test" />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });

    it('should use name as id if no id provided', () => {
      render(<Checkbox name="terms" label="Test" />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');
    });

    it('should generate random id if no id or name provided', () => {
      render(<Checkbox label="Test" />);

      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.id).toMatch(/^checkbox-/);
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      render(<Checkbox error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<Checkbox error="Error" />);

      expect(screen.getByText('Error')).toHaveClass('text-red-500');
    });
  });

  describe('label association', () => {
    it('should associate label with checkbox', () => {
      render(<Checkbox id="test-checkbox" label="Test Label" />);

      const label = screen.getByText('Test Label');

      expect(label.closest('label')).toHaveAttribute('for', 'test-checkbox');
    });

    it('should toggle checkbox when label is clicked', () => {
      const onChange = vi.fn();
      render(<Checkbox label="Click me" onChange={onChange} />);

      fireEvent.click(screen.getByText('Click me'));

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to input element', () => {
      const ref = vi.fn();

      render(<Checkbox ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });
});
