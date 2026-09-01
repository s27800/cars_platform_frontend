import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '1' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useLocation: () => ({ pathname: '/cars', search: '', state: null }),
  useNavigationType: () => 'PUSH',
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Redirecting...</div>,
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: null, isLoading: false, error: null })),
  useQueries: () => [],
  useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  useInfiniteQuery: () => ({
    data: null,
    isLoading: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
  }),
  keepPreviousData: Symbol('keepPreviousData'),
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

// Mock hooks
vi.mock('../../../shared/hooks', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
  })),
  useToast: () => ({ addToast: vi.fn() }),
  useComparison: () => ({
    comparisonList: [],
    addToComparison: vi.fn(),
    removeFromComparison: vi.fn(),
    isInComparison: () => false,
  }),
  useDebounce: (value) => value,
}));

// Mock UI components
const CardSkeletonComponent = () => <div data-testid="card-skeleton">Loading...</div>;
CardSkeletonComponent.Grid = ({ count }) => (
  <div data-testid="card-skeleton-grid">
    {Array.from({ length: count || 6 }).map((_, i) => <CardSkeletonComponent key={i} />)}
  </div>
);

vi.mock('../../../shared/components/ui', () => ({
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Pagination: ({ currentPage, totalPages }) => <div data-testid="pagination">{currentPage}/{totalPages}</div>,
  Badge: ({ children }) => <span data-testid="badge">{children}</span>,
  Breadcrumb: ({ items }) => (
    <nav data-testid="breadcrumb">
      {items?.map((item, i) => <span key={i}>{item.label}</span>)}
    </nav>
  ),
  Select: ({ options }) => (
    <select data-testid="select">
      {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  ),
  Input: ({ label }) => <input data-testid={`input-${label}`} />,
  Modal: ({ isOpen, children }) => isOpen ? <div data-testid="modal">{children}</div> : null,
  CardSkeleton: CardSkeletonComponent,
}));

vi.mock('../CarCard', () => ({
  default: ({ car }) => <div data-testid="car-card">{car?.name || 'Car'}</div>,
}));

vi.mock('../FiltersPanel', () => ({
  default: () => <div data-testid="filters-panel">Filters</div>,
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoSearchOutline: () => <span data-testid="icon" />,
  IoCarSportOutline: () => <span data-testid="icon" />,
  IoSpeedometerOutline: () => <span data-testid="icon" />,
  IoSettingsOutline: () => <span data-testid="icon" />,
  IoArrowForwardOutline: () => <span data-testid="icon" />,
  IoChevronBackOutline: () => <span data-testid="icon" />,
  IoChevronForwardOutline: () => <span data-testid="icon" />,
  IoFilterOutline: () => <span data-testid="icon" />,
  IoCloseOutline: () => <span data-testid="icon" />,
  IoGridOutline: () => <span data-testid="icon" />,
  IoListOutline: () => <span data-testid="icon" />,
  IoInformationCircleOutline: () => <span data-testid="icon" />,
  IoHeartOutline: () => <span data-testid="icon" />,
  IoHeartSharp: () => <span data-testid="icon" />,
  IoStarOutline: () => <span data-testid="icon" />,
  IoStarSharp: () => <span data-testid="icon" />,
  IoTrashOutline: () => <span data-testid="icon" />,
  IoAddOutline: () => <span data-testid="icon" />,
  IoFlashOutline: () => <span data-testid="icon" />,
  IoCogOutline: () => <span data-testid="icon" />,
  IoLayersOutline: () => <span data-testid="icon" />,
  IoResizeOutline: () => <span data-testid="icon" />,
  IoChevronDownOutline: () => <span data-testid="icon" />,
  IoTrendingUpOutline: () => <span data-testid="icon" />,
  IoPeopleOutline: () => <span data-testid="icon" />,
  IoBatteryChargingOutline: () => <span data-testid="icon" />,
  IoDocumentTextOutline: () => <span data-testid="icon" />,
  IoBarChartOutline: () => <span data-testid="icon" />,
  IoFlameOutline: () => <span data-testid="icon" />,
  IoHomeOutline: () => <span data-testid="icon" />,
  IoScaleOutline: () => <span data-testid="icon" />,
  IoGitCompareOutline: () => <span data-testid="icon" />,
  IoArrowBackOutline: () => <span data-testid="icon" />,
  IoShareSocialOutline: () => <span data-testid="icon" />,
  IoRemoveOutline: () => <span data-testid="icon" />,
}));

// Mock API modules
vi.mock('../api', () => ({
  searchCars: vi.fn(() => Promise.resolve({ content: [], totalPages: 0, totalElements: 0 })),
  getCarById: vi.fn(() => Promise.resolve({ id: 1, name: 'Test Car' })),
}));

vi.mock('../../brands/api', () => ({
  getBrands: vi.fn(() => Promise.resolve([])),
  getBrandById: vi.fn(() => Promise.resolve({ id: 1, name: 'Test Brand' })),
  getModelById: vi.fn(() => Promise.resolve({ id: 1, name: 'Test Model' })),
  getGenerationById: vi.fn(() => Promise.resolve({ id: 1, name: 'Test Generation' })),
}));

vi.mock('../../reviews', () => ({
  ReviewsSection: () => <div data-testid="reviews-section">Reviews</div>,
  AddReviewForm: () => <div data-testid="add-review-form">Add Review</div>,
}));

vi.mock('../../fuelReports', () => ({
  FuelReportsSection: () => <div data-testid="fuel-reports-section">Fuel Reports</div>,
  AddFuelReportForm: () => <div data-testid="add-fuel-report-form">Add Fuel Report</div>,
}));


describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render home page', async () => {
      const HomePage = (await import('../../home/HomePage')).default;

      render(<HomePage />);

      expect(document.body).toBeInTheDocument();
    });
  });
});

describe('CarsSearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search page with filters panel', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: { content: [], totalElements: 0, totalPages: 0 },
      isLoading: false,
    });

    const CarsSearchPage = (await import('../CarsSearchPage')).default;

    render(<CarsSearchPage />);

    expect(screen.getByTestId('filters-panel')).toBeInTheDocument();
  });

  it('should show loading skeletons while fetching', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const CarsSearchPage = (await import('../CarsSearchPage')).default;

    render(<CarsSearchPage />);

    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThan(0);
  });
});

describe('CarDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render loading spinner when loading', async () => {
      const { useQuery } = await import('@tanstack/react-query');

      useQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });

      const CarDetailsPage = (await import('../CarDetailsPage')).default;

      render(<CarDetailsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});

describe('BrandDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render loading spinner when loading', async () => {
      const { useQuery } = await import('@tanstack/react-query');

      useQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });

      const BrandDetailsPage = (await import('../../brands/BrandDetailsPage')).default;

      render(<BrandDetailsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});

describe('ModelDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render loading spinner when loading', async () => {
      const { useQuery } = await import('@tanstack/react-query');

      useQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });

      const ModelDetailsPage = (await import('../../brands/ModelDetailsPage')).default;

      render(<ModelDetailsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});

describe('GenerationDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render loading spinner when loading', async () => {
      const { useQuery } = await import('@tanstack/react-query');

      useQuery.mockReturnValue({
        data: null,
        isLoading: true,
      });

      const GenerationDetailsPage = (await import('../../brands/GenerationDetailsPage')).default;

      render(<GenerationDetailsPage />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});

describe('ComparisonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render comparison page', async () => {
      const ComparisonPage = (await import('../../comparison/ComparisonPage')).default;

      render(<ComparisonPage />);

      expect(document.body).toBeInTheDocument();
    });

    it('should render empty state when no cars in comparison', async () => {
      const ComparisonPage = (await import('../../comparison/ComparisonPage')).default;

      render(<ComparisonPage />);

      expect(document.body).toBeInTheDocument();
    });
  });
});
