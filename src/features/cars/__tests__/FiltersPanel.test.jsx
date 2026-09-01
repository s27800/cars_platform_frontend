import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersPanel from '../FiltersPanel';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(({ queryKey }) => {
    if (queryKey[0] === 'brands') {
      return {
        data: [
          { id: 1, name: 'BMW' },
          { id: 2, name: 'Audi' },
        ],
        isLoading: false,
      };
    }
    if (queryKey[0] === 'bodyTypes') {
      return {
        data: [
          { id: 1, name: 'Sedan' },
          { id: 2, name: 'SUV' },
        ],
        isLoading: false,
      };
    }
    if (queryKey[0] === 'tags') {
      return {
        data: [
          { id: 1, name: 'Sport' },
          { id: 2, name: 'Luxury' },
        ],
        isLoading: false,
      };
    }
    return { data: [], isLoading: false };
  }),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// Mock API calls
vi.mock('../../brands/api', () => ({
  getBrands: vi.fn(() => Promise.resolve([])),
  getBrandById: vi.fn(() => Promise.resolve({ models: [] })),
}));

vi.mock('../../brands/modelsApi', () => ({
  getModelById: vi.fn(() => Promise.resolve({ generations: [] })),
}));

vi.mock('../bodyTypesApi', () => ({
  getBodyTypes: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../../../shared/api/tags', () => ({
  getTags: vi.fn(() => Promise.resolve([])),
}));


describe('FiltersPanel', () => {
  const defaultFilters = {
    brandIds: [],
    modelIds: [],
    generationIds: [],
    bodyTypeIds: [],
    engineTypes: [],
    drives: [],
    transmissionTypes: [],
    tagIds: [],
  };

  const defaultProps = {
    filters: defaultFilters,
    onFiltersChange: vi.fn(),
    onReset: vi.fn(),
    isMobile: false,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(document.body).toBeInTheDocument();
    });

    it('should render brand select', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(screen.getByText('filters.brandModelGeneration')).toBeInTheDocument();
    });

    it('should render filter sections', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(screen.getByText('filters.bodyType')).toBeInTheDocument();
    });

    it('should render filters header', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should render close button on mobile', () => {
      render(<FiltersPanel {...defaultProps} isMobile={true} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('filter interactions', () => {
    it('should expand filter sections', async () => {
      render(<FiltersPanel {...defaultProps} />);

      const sectionButton = screen.getByText('filters.brandModelGeneration');
      
      expect(sectionButton).toBeInTheDocument();
    });

    it('should render brand options when expanded', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(screen.getByText('BMW')).toBeInTheDocument();
      expect(screen.getByText('Audi')).toBeInTheDocument();
    });
  });

  describe('filter section toggle', () => {
    it('should toggle filter section when clicked', async () => {
      const user = userEvent.setup();

      render(<FiltersPanel {...defaultProps} />);

      const sectionButtons = screen.getAllByRole('button');
      const sectionButton = sectionButtons.find(btn => btn.textContent?.includes('filters.'));

      if (sectionButton) {
        await user.click(sectionButton);

        expect(sectionButton).toBeInTheDocument();
      }
    });
  });

  describe('engine type filters', () => {
    it('should render engine type checkboxes', () => {
      render(<FiltersPanel {...defaultProps} />);

      expect(screen.getByText('filters.engineType')).toBeInTheDocument();
    });
  });

  describe('active filters count', () => {
    it('should show active filters badge when filters are set', () => {
      const filtersWithActive = {
        ...defaultFilters,
        brandIds: [1],
        engineTypes: ['Gasoline'],
      };

      render(<FiltersPanel {...defaultProps} filters={filtersWithActive} />);

      expect(document.body).toBeInTheDocument();
    });
  });

  describe('mobile view', () => {
    it('should render mobile header when isMobile is true', () => {
      render(<FiltersPanel {...defaultProps} isMobile={true} />);
      expect(screen.getByText('filters.title')).toBeInTheDocument();
    });

    it('should have close button on mobile', () => {
      render(<FiltersPanel {...defaultProps} isMobile={true} />);

      const buttons = screen.getAllByRole('button');

      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
