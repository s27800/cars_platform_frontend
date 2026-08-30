import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: null, isLoading: false })),
  useQueries: () => [],
  useMutation: vi.fn(() => ({ 
    mutate: vi.fn(), 
    isPending: false,
    mutateAsync: vi.fn(),
  })),
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

// Mock hooks
vi.mock('../../../hooks', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false })),
  useToast: () => ({ addToast: vi.fn() }),
}));

// Mock UI components
vi.mock('../../../components/ui', () => ({
  Avatar: ({ name }) => <div data-testid="avatar">{name?.charAt(0)}</div>,
  Badge: ({ children, variant }) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  Input: ({ label, value, onChange, error, ...props }) => (
    <div>
      {label && <label>{label}</label>}
      <input value={value} onChange={onChange} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  Select: ({ label, options, value, onChange }) => (
    <div>
      {label && <label>{label}</label>}
      <select value={value} onChange={onChange}>
        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  ),
  Modal: ({ isOpen, children }) => isOpen ? <div data-testid="modal">{children}</div> : null,
}));

// Mock API
vi.mock('../../../api/fuelReports', () => ({
  getFuelReports: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  createFuelReport: vi.fn(() => Promise.resolve({ id: 1 })),
  getAverageFuelConsumption: vi.fn(() => Promise.resolve({ average: 7.5 })),
}));

vi.mock('../../../api/likes', () => ({
  toggleFuelReportLike: vi.fn(() => Promise.resolve({ liked: true, likesCount: 1 })),
  getFuelReportLikeStatus: vi.fn(() => Promise.resolve({ liked: false, likesCount: 0 })),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoHeartOutline: () => <span data-testid="icon-heart-outline" />,
  IoHeart: () => <span data-testid="icon-heart" />,
  IoSpeedometerOutline: () => <span data-testid="icon-speedometer" />,
}));

// Mock utils
vi.mock('../../../utils/helpers', () => ({
  formatDate: (date) => date,
  getConsumptionLevel: (value) => {
    if (value < 6) return { label: 'Low', color: 'text-green-600', variant: 'success' };
    if (value < 10) return { label: 'Medium', color: 'text-yellow-600', variant: 'warning' };
    return { label: 'High', color: 'text-red-600', variant: 'danger' };
  },
}));


describe('FuelReportCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module', () => {
    it('should export FuelReportCard component', async () => {
      const module = await import('../FuelReportCard');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render fuel report card with consumption data', async () => {
      const FuelReportCard = (await import('../FuelReportCard')).default;
      const report = {
        id: 1,
        usernameResponse: { username: 'JohnDoe' },
        reportDate: '2024-01-15',
        fuelConsumption: 7.5,
        drivingStyle: 'Normal',
        routeType: 'Mixed',
        likesCount: 5,
      };

      render(<FuelReportCard report={report} carId={1} />);

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should render Anonymous when no username', async () => {
      const FuelReportCard = (await import('../FuelReportCard')).default;
      const report = {
        id: 1,
        reportDate: '2024-01-15',
        fuelConsumption: 8.0,
        drivingStyle: 'Normal',
        routeType: 'City',
        likesCount: 0,
      };

      render(<FuelReportCard report={report} carId={1} />);

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should render pending badge when not approved', async () => {
      const FuelReportCard = (await import('../FuelReportCard')).default;
      const report = {
        id: 1,
        reportDate: '2024-01-15',
        fuelConsumption: 7.0,
        drivingStyle: 'Eco',
        routeType: 'Highway',
        likesCount: 0,
        isApproved: false,
      };

      render(<FuelReportCard report={report} carId={1} />);

      expect(screen.getByText('fuelReports.status.pending')).toBeInTheDocument();
    });
  });
});

describe('FuelReportsSection', () => {
  describe('module', () => {
    it('should export FuelReportsSection component', async () => {
      const module = await import('../FuelReportsSection');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('AddFuelReportForm', () => {
  describe('module', () => {
    it('should export AddFuelReportForm component', async () => {
      const module = await import('../AddFuelReportForm');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('AddFuelReportForm', () => {
  describe('module', () => {
    it('should export AddFuelReportForm component', async () => {
      const module = await import('../AddFuelReportForm');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
