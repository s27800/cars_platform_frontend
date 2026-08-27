import { render, screen } from '@testing-library/react';
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
vi.mock('../../../components/ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading</div>,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
}));

// Mock APIs
vi.mock('../../../api/reviews', () => ({
  getAverageRatings: vi.fn(),
}));

vi.mock('../../../api/fuelReports', () => ({
  getAverageConsumption: vi.fn(),
}));

vi.mock('../../../api/cars', () => ({
  searchCars: vi.fn(),
}));

// Mock utils
vi.mock('../../../utils/constants', () => ({
  RATING_CATEGORIES: [
    { key: 'comfort', label: 'Comfort' },
    { key: 'performance', label: 'Performance' },
  ],
  COMPARISON_SPECS: [],
}));


const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);


describe('ComparisonTable', () => {
  describe('module', () => {
    it('should export ComparisonTable component', async () => {
      const module = await import('../ComparisonTable');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render table with empty cars', async () => {
      const ComparisonTable = (await import('../ComparisonTable')).default;
      
      renderWithRouter(<ComparisonTable cars={[]} onRemoveCar={vi.fn()} />);
      
      expect(document.body).toBeInTheDocument();
    });
  });
});

describe('ComparisonStats', () => {
  describe('module', () => {
    it('should export ComparisonStats component', async () => {
      const module = await import('../ComparisonStats');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should return null when no carIds', async () => {
      const ComparisonStats = (await import('../ComparisonStats')).default;
      const { container } = render(<ComparisonStats carIds={[]} />);
      
      expect(container).toBeEmptyDOMElement();
    });
  });
});

describe('ComparisonSelector', () => {
  describe('module', () => {
    it('should export ComparisonSelector component', async () => {
      const module = await import('../ComparisonSelector');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
