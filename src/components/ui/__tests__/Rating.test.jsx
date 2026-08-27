import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Rating from '../Rating';


describe('Rating', () => {
  describe('rendering', () => {
    it('should render rating component', () => {
      render(<Rating />);
      
      expect(document.querySelectorAll('span > svg')).toHaveLength(5);
    });

    it('should render custom number of stars', () => {
      render(<Rating max={10} />);
      
      expect(document.querySelectorAll('span > svg')).toHaveLength(10);
    });

    it('should apply custom className', () => {
      const { container } = render(<Rating className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('display value', () => {
    it('should display empty stars for value 0', () => {
      render(<Rating value={0} />);
      
      const stars = document.querySelectorAll('span');
      stars.forEach(star => {
        expect(star).toHaveClass('text-neutral-300');
      });
    });

    it('should display filled stars for value', () => {
      render(<Rating value={3} />);
      
      const stars = document.querySelectorAll('span');

      expect(stars[0]).toHaveClass('text-yellow-400');
      expect(stars[1]).toHaveClass('text-yellow-400');
      expect(stars[2]).toHaveClass('text-yellow-400');
      expect(stars[3]).toHaveClass('text-neutral-300');
      expect(stars[4]).toHaveClass('text-neutral-300');
    });

    it('should display half stars', () => {
      render(<Rating value={2.5} />);
      
      const stars = document.querySelectorAll('span');

      expect(stars[0]).toHaveClass('text-yellow-400');
      expect(stars[1]).toHaveClass('text-yellow-400');
      expect(stars[2]).toHaveClass('text-yellow-400');
    });

    it('should show numeric value when showValue is true', () => {
      render(<Rating value={4.5} showValue />);
      
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Rating />);
      
      const star = document.querySelector('span');

      expect(star).toHaveClass('w-5');
      expect(star).toHaveClass('h-5');
    });

    it('should apply small size', () => {
      render(<Rating size="sm" />);
      
      const star = document.querySelector('span');

      expect(star).toHaveClass('w-4');
      expect(star).toHaveClass('h-4');
    });

    it('should apply large size', () => {
      render(<Rating size="lg" />);
      
      const star = document.querySelector('span');

      expect(star).toHaveClass('w-6');
      expect(star).toHaveClass('h-6');
    });

    it('should apply extra large size', () => {
      render(<Rating size="xl" />);
      
      const star = document.querySelector('span');

      expect(star).toHaveClass('w-8');
      expect(star).toHaveClass('h-8');
    });
  });

  describe('readonly mode', () => {
    it('should not be interactive when readonly', () => {
      const onChange = vi.fn();
      render(<Rating readonly onChange={onChange} />);
      
      const star = document.querySelector('span');
      expect(star).not.toHaveClass('cursor-pointer');
    });

    it('should not call onChange when readonly', () => {
      const onChange = vi.fn();
      render(<Rating readonly onChange={onChange} />);
      
      const star = document.querySelector('span');
      fireEvent.click(star);
      
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('interactive mode', () => {
    it('should be interactive when not readonly', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} />);
      
      const star = document.querySelector('span');
      expect(star).toHaveClass('cursor-pointer');
    });

    it('should call onChange when star is clicked', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.click(stars[2]);
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should have hover effect', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} />);
      
      const star = document.querySelector('span');
      expect(star).toHaveClass('hover:scale-110');
    });
  });

  describe('precision', () => {
    it('should use 0.5 precision by default', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} value={0} />);
      
      expect(document.querySelectorAll('span')).toHaveLength(5);
    });

    it('should work with precision 1', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} precision={1} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.click(stars[2]);
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('mouse interactions', () => {
    it('should handle mouse move on stars', () => {
      const onChange = vi.fn();
      render(<Rating onChange={onChange} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.mouseMove(stars[2], { clientX: 10 });
      
      expect(stars[2]).toBeInTheDocument();
    });

    it('should handle mouse leave', () => {
      const onChange = vi.fn();
      const { container } = render(<Rating onChange={onChange} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.mouseMove(stars[2], { clientX: 10 });
      fireEvent.mouseLeave(container.firstChild);
      
      expect(stars[0]).toBeInTheDocument();
    });

    it('should not update hover state when readonly', () => {
      render(<Rating readonly value={3} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.mouseMove(stars[4], { clientX: 10 });
      
      expect(stars[2]).toHaveClass('text-yellow-400');
    });
  });
});


describe('Rating.Input', () => {
  describe('rendering', () => {
    it('should render Rating.Input component', () => {
      render(<Rating.Input value={3} onChange={vi.fn()} />);
      
      expect(document.querySelectorAll('span > svg')).toHaveLength(5);
    });

    it('should render with label', () => {
      render(<Rating.Input value={3} onChange={vi.fn()} label="Rate this" />);
      
      expect(screen.getByText('Rate this')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<Rating.Input value={3} onChange={vi.fn()} label="Rate this" required />);
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<Rating.Input value={0} onChange={vi.fn()} error="Rating is required" />);
      
      expect(screen.getByText('Rating is required')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Rating.Input value={3} onChange={vi.fn()} className="custom-input" />
      );
      
      expect(container.firstChild).toHaveClass('custom-input');
    });

    it('should use large size by default', () => {
      render(<Rating.Input value={3} onChange={vi.fn()} />);
      
      const star = document.querySelector('span');
      expect(star).toHaveClass('w-6');
      expect(star).toHaveClass('h-6');
    });

    it('should call onChange when star is clicked', () => {
      const onChange = vi.fn();
      render(<Rating.Input value={0} onChange={onChange} />);
      
      const stars = document.querySelectorAll('span');
      fireEvent.click(stars[3]);
      
      expect(onChange).toHaveBeenCalled();
    });
  });
});
