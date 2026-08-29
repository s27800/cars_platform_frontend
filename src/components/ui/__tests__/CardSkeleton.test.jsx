import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardSkeleton from '../CardSkeleton';


describe('CardSkeleton', () => {
  describe('rendering', () => {
    it('should render card skeleton', () => {
      const { container } = render(<CardSkeleton />);
      
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<CardSkeleton className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have card styling', () => {
      const { container } = render(<CardSkeleton />);
      
      expect(container.firstChild).toHaveClass('rounded-2xl');
      expect(container.firstChild).toHaveClass('overflow-hidden');
    });
  });

  describe('skeleton elements', () => {
    it('should render image skeleton', () => {
      render(<CardSkeleton />);
      expect(document.querySelectorAll('[role="presentation"]').length).toBeGreaterThan(0);
    });

    it('should render title skeleton', () => {
      const { container } = render(<CardSkeleton />);
      expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    });

    it('should render specs row skeletons', () => {
      const { container } = render(<CardSkeleton />);
      expect(container.querySelectorAll('.rounded-xl, .rounded-lg').length).toBeGreaterThan(0);
    });

    it('should render button skeleton', () => {
      const { container } = render(<CardSkeleton />);
      expect(container.querySelector('.flex-1')).toBeInTheDocument();
    });
  });
});


describe('CardSkeleton.Grid', () => {
  describe('rendering', () => {
    it('should render default 6 card skeletons', () => {
      render(<CardSkeleton.Grid />);
      
      const cards = document.querySelectorAll('.rounded-2xl.overflow-hidden');

      expect(cards).toHaveLength(6);
    });

    it('should render custom number of cards', () => {
      render(<CardSkeleton.Grid count={3} />);
      
      const cards = document.querySelectorAll('.rounded-2xl.overflow-hidden');
      
      expect(cards).toHaveLength(3);
    });

    it('should apply custom className', () => {
      const { container } = render(<CardSkeleton.Grid className="custom-grid" />);
      
      expect(container.firstChild).toHaveClass('custom-grid');
    });

    it('should have grid styling', () => {
      const { container } = render(<CardSkeleton.Grid />);
      
      expect(container.firstChild).toHaveClass('grid');
    });

    it('should have responsive grid columns', () => {
      const { container } = render(<CardSkeleton.Grid />);
      
      expect(container.firstChild).toHaveClass('sm:grid-cols-2');
      expect(container.firstChild).toHaveClass('lg:grid-cols-3');
    });
  });
});
