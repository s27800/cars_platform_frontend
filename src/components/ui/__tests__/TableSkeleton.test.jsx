import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TableSkeleton from '../TableSkeleton';


describe('TableSkeleton', () => {
  describe('rendering', () => {
    it('should render table skeleton', () => {
      render(<TableSkeleton />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<TableSkeleton className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have table styling', () => {
      const { container } = render(<TableSkeleton />);
      
      expect(container.firstChild).toHaveClass('rounded-xl');
      expect(container.firstChild).toHaveClass('overflow-hidden');
    });
  });

  describe('rows', () => {
    it('should render default 5 rows', () => {
      render(<TableSkeleton />);
      
      const rows = screen.getAllByRole('row');

      expect(rows).toHaveLength(6);
    });

    it('should render custom number of rows', () => {
      render(<TableSkeleton rows={3} />);
      
      const rows = screen.getAllByRole('row');

      expect(rows).toHaveLength(4);
    });
  });

  describe('columns', () => {
    it('should render default 4 columns', () => {
      render(<TableSkeleton />);
      
      const headerCells = screen.getAllByRole('columnheader');

      expect(headerCells).toHaveLength(4);
    });

    it('should render custom number of columns', () => {
      render(<TableSkeleton columns={6} />);
      
      const headerCells = screen.getAllByRole('columnheader');

      expect(headerCells).toHaveLength(6);
    });

    it('should render correct number of cells per row', () => {
      render(<TableSkeleton columns={4} rows={2} />);

      const cells = screen.getAllByRole('cell');

      expect(cells).toHaveLength(8);
    });
  });

  describe('header', () => {
    it('should show header by default', () => {
      render(<TableSkeleton />);
      
      expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0);
    });

    it('should hide header when showHeader is false', () => {
      render(<TableSkeleton showHeader={false} />);
      
      expect(screen.queryAllByRole('columnheader')).toHaveLength(0);
    });
  });

  describe('skeleton elements', () => {
    it('should render skeleton elements in cells', () => {
      render(<TableSkeleton />);
      
      const skeletons = document.querySelectorAll('[role="presentation"]');

      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have animation on skeletons', () => {
      render(<TableSkeleton />);
      
      const animatedElements = document.querySelectorAll('.animate-pulse');
      
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });
});
