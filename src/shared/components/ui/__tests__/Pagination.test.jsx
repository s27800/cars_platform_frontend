import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '../Pagination';


describe('Pagination', () => {
  const defaultProps = {
    currentPage: 0,
    totalPages: 10,
    totalElements: 100,
    pageSize: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render pagination when totalPages > 1', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'a11y.previousPage' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'a11y.nextPage' })).toBeInTheDocument();
    });

    it('should not render when totalPages is 1', () => {
      const { container } = render(<Pagination {...defaultProps} totalPages={1} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should not render when totalPages is 0', () => {
      const { container } = render(<Pagination {...defaultProps} totalPages={0} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should apply custom className', () => {
      const { container } = render(<Pagination {...defaultProps} className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('page info', () => {
    it('should show page info by default', () => {
      render(<Pagination {...defaultProps} />);

      const infoText = screen.getByText(/pagination\.showing/);

      expect(infoText).toBeInTheDocument();
    });

    it('should not show page info when showInfo is false', () => {
      render(<Pagination {...defaultProps} showInfo={false} />);

      expect(screen.queryByText(/pagination\.showing/)).not.toBeInTheDocument();
    });

    it('should show correct range for middle page', () => {
      render(<Pagination {...defaultProps} currentPage={4} />);

      const infoText = screen.getByText(/pagination\.showing/);

      expect(infoText).toBeInTheDocument();
    });

    it('should show correct range for last page', () => {
      render(<Pagination {...defaultProps} currentPage={9} totalElements={95} />);

      const infoText = screen.getByText(/pagination\.showing/);

      expect(infoText).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should disable previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={0} />);

      expect(screen.getByRole('button', { name: 'a11y.previousPage' })).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={9} />);

      expect(screen.getByRole('button', { name: 'a11y.nextPage' })).toBeDisabled();
    });

    it('should call onPageChange with previous page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      fireEvent.click(screen.getByRole('button', { name: 'a11y.previousPage' }));

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange with next page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      fireEvent.click(screen.getByRole('button', { name: 'a11y.nextPage' }));

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(6);
    });
  });

  describe('page buttons', () => {
    it('should highlight current page', () => {
      render(<Pagination {...defaultProps} currentPage={0} />);

      const currentPageButton = screen.getByRole('button', { name: '1' });

      expect(currentPageButton).toHaveClass('bg-primary-600');
    });

    it('should call onPageChange when page button is clicked', () => {
      render(<Pagination {...defaultProps} currentPage={0} />);

      fireEvent.click(screen.getByRole('button', { name: '3' }));

      expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });

    it('should show ellipsis for many pages', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('should show first page button when not visible in range', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    });

    it('should show last page button when not visible in range', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });
  });

  describe('visible pages calculation', () => {
    it('should show correct pages at the beginning', () => {
      render(<Pagination {...defaultProps} currentPage={0} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('should show correct pages in the middle', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    });

    it('should show correct pages at the end', () => {
      render(<Pagination {...defaultProps} currentPage={9} />);

      expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });
  });
});
