import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GlobalSearch from '../GlobalSearch';


// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock('../api', () => ({
  searchCars: vi.fn(() => Promise.resolve({ content: [] })),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    isFetching: false,
  })),
}));

// Mock hooks
vi.mock('../../../shared/hooks', () => ({
  useDebounce: (value) => value,
}));

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Input: ({ value, onChange, onFocus, onKeyDown, placeholder, leftIcon, rightIcon, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      data-testid="search-input"
      {...props}
    />
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));


// Helper
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('GlobalSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render search input', () => {
      renderWithRouter(<GlobalSearch />);

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      renderWithRouter(<GlobalSearch placeholder="Search cars..." />);

      expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search cars...');
    });

    it('should apply custom className', () => {
      const { container } = renderWithRouter(
        <GlobalSearch className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('input behavior', () => {
    it('should update query on input change', () => {
      renderWithRouter(<GlobalSearch />);

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'BMW' } });

      expect(input).toHaveValue('BMW');
    });

    it('should clear input on clear button click', () => {
      renderWithRouter(<GlobalSearch />);

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'BMW' } });

      expect(input).toHaveValue('BMW');

      fireEvent.change(input, { target: { value: '' } });

      expect(input).toHaveValue('');
    });
  });

  describe('search submission', () => {
    it('should navigate to search results on Enter', () => {
      renderWithRouter(<GlobalSearch />);

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'BMW' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockNavigate).toHaveBeenCalledWith('/cars?search=BMW');
    });

    it('should not navigate when query is empty', () => {
      renderWithRouter(<GlobalSearch />);

      const input = screen.getByTestId('search-input');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should call onSearchSubmit callback', () => {
      const onSearchSubmit = vi.fn();
      renderWithRouter(<GlobalSearch onSearchSubmit={onSearchSubmit} />);

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'BMW' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onSearchSubmit).toHaveBeenCalled();
    });
  });
});
