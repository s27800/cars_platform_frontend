import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useQueries: () => [],
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading</div>,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Input: vi.fn().mockImplementation(({ placeholder, leftIcon, rightIcon, ...props }) => (
    <input placeholder={placeholder} {...props} />
  )),
}));

// Mock APIs
vi.mock('../../reviews/api', () => ({
  getAverageRatings: vi.fn(),
}));

vi.mock('../../fuelReports/api', () => ({
  getAverageConsumption: vi.fn(),
}));

vi.mock('../../cars/api', () => ({
  searchCars: vi.fn(),
}));

// Mock utils
vi.mock('../../reviews', () => ({
  RATING_CATEGORIES: [
    { key: 'comfort', labelKey: 'comfort' },
    { key: 'performance', labelKey: 'performance' },
  ],
}));


const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);


describe('ComparisonTable', () => {

  describe('rendering', () => {
    it('should render table with empty cars', async () => {
      const ComparisonTable = (await import('../ComparisonTable')).default;

      renderWithRouter(<ComparisonTable cars={[]} onRemoveCar={vi.fn()} />);

      expect(document.body).toBeInTheDocument();
    });
  });
});

describe('ComparisonStats', () => {

  describe('rendering', () => {
    it('should return null when no carIds', async () => {
      const ComparisonStats = (await import('../ComparisonStats')).default;
      const { container } = render(<ComparisonStats carIds={[]} />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});

describe('ComparisonSelector', () => {
  it('should render search input with placeholder', async () => {
    const ComparisonSelector = (await import('../ComparisonSelector')).default;

    renderWithRouter(<ComparisonSelector onSelect={vi.fn()} />);

    expect(document.querySelector('input')).toBeInTheDocument();
    expect(document.querySelector('input')).toHaveAttribute('placeholder', 'comparison.searchFirst');
  });

  it('should accept custom placeholder', async () => {
    const ComparisonSelector = (await import('../ComparisonSelector')).default;

    renderWithRouter(<ComparisonSelector onSelect={vi.fn()} placeholder="Custom placeholder" />);

    expect(document.querySelector('input')).toHaveAttribute('placeholder', 'Custom placeholder');
  });
});
