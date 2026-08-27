import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextArea from '../TextArea';


describe('TextArea', () => {
  describe('rendering', () => {
    it('should render textarea element', () => {
      render(<TextArea />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<TextArea label="Description" />);
      
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<TextArea className="custom-class" />);
      
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should render with placeholder', () => {
      render(<TextArea placeholder="Enter text..." />);
      
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  describe('value and change', () => {
    it('should handle value change', () => {
      const onChange = vi.fn();

      render(<TextArea onChange={onChange} />);
      
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test content' } });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      render(<TextArea value="Controlled text" onChange={() => {}} />);
      
      expect(screen.getByRole('textbox')).toHaveValue('Controlled text');
    });
  });

  describe('rows', () => {
    it('should have default rows of 4', () => {
      render(<TextArea />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    });

    it('should apply custom rows', () => {
      render(<TextArea rows={6} />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
    });
  });

  describe('resize', () => {
    it('should have vertical resize by default', () => {
      render(<TextArea />);
      
      expect(screen.getByRole('textbox')).toHaveClass('resize-y');
    });

    it('should apply no resize', () => {
      render(<TextArea resize="none" />);
      
      expect(screen.getByRole('textbox')).toHaveClass('resize-none');
    });

    it('should apply horizontal resize', () => {
      render(<TextArea resize="horizontal" />);
      
      expect(screen.getByRole('textbox')).toHaveClass('resize-x');
    });

    it('should apply both resize', () => {
      render(<TextArea resize="both" />);
      
      expect(screen.getByRole('textbox')).toHaveClass('resize');
    });
  });

  describe('error state', () => {
    it('should display error message', () => {
      render(<TextArea error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should have error styling', () => {
      render(<TextArea error="Error" />);
      
      expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
    });
  });

  describe('hint', () => {
    it('should display hint text', () => {
      render(<TextArea hint="Maximum 500 characters" />);
      
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });

    it('should not show hint when error is present', () => {
      render(<TextArea hint="Hint text" error="Error text" />);
      
      expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });
  });

  describe('maxLength', () => {
    it('should apply maxLength attribute', () => {
      render(<TextArea maxLength={500} />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '500');
    });
  });

  describe('character count', () => {
    it('should show character count when showCount is true', () => {
      render(<TextArea showCount value="Hello" maxLength={100} onChange={() => {}} />);
      
      expect(screen.getByText('5/100')).toBeInTheDocument();
    });

    it('should not show character count by default', () => {
      render(<TextArea value="Hello" maxLength={100} onChange={() => {}} />);
      
      expect(screen.queryByText(/\d+\/\d+/)).not.toBeInTheDocument();
    });
  });

  describe('fullWidth', () => {
    it('should be full width by default', () => {
      render(<TextArea />);
      
      expect(screen.getByRole('textbox').closest('div')).toHaveClass('w-full');
    });

    it('should not be full width when fullWidth is false', () => {
      const { container } = render(<TextArea fullWidth={false} />);
      
      expect(container.firstChild).not.toHaveClass('w-full');
    });
  });

  describe('id and label association', () => {
    it('should use provided id', () => {
      render(<TextArea id="custom-id" label="Label" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });

    it('should use name as id if no id provided', () => {
      render(<TextArea name="description" label="Label" />);
      
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'description');
    });
  });

  describe('forwarded ref', () => {
    it('should forward ref to textarea element', () => {
      const ref = vi.fn();
      
      render(<TextArea ref={ref} />);
      
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
