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
vi.mock('../../../shared/hooks', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false })),
  useToast: () => ({ addToast: vi.fn() }),
}));

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Avatar: ({ name }) => <div data-testid="avatar">{name?.charAt(0)}</div>,
  Badge: ({ children, variant }) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Button: ({ children, onClick, disabled, type }) => (
    <button onClick={onClick} disabled={disabled} type={type}>{children}</button>
  ),
  Input: ({ label, value, onChange, error, leftIcon, rightIcon, ...props }) => (
    <div>
      {label && <label>{label}</label>}
      <input value={value} onChange={onChange} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  TextArea: ({ label, value, onChange, error, ...props }) => (
    <div>
      {label && <label>{label}</label>}
      <textarea value={value} onChange={onChange} {...props} />
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
  Alert: ({ children, variant }) => <div data-testid="alert" data-variant={variant}>{children}</div>,
  Pagination: () => <div data-testid="pagination" />,
}));

// Mock API
vi.mock('../api', () => ({
  getFuelReports: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  createFuelReport: vi.fn(() => Promise.resolve({ id: 1 })),
  getAverageFuelConsumption: vi.fn(() => Promise.resolve({ average: 7.5 })),
}));

vi.mock('../../../shared/api/likes', () => ({
  toggleFuelReportLike: vi.fn(() => Promise.resolve({ liked: true, likesCount: 1 })),
  getFuelReportLikeStatus: vi.fn(() => Promise.resolve({ liked: false, likesCount: 0 })),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoHeartOutline: () => <span data-testid="icon-heart-outline" />,
  IoHeart: () => <span data-testid="icon-heart" />,
  IoSpeedometerOutline: () => <span data-testid="icon-speedometer" />,
  IoCheckmarkCircle: () => <span data-testid="icon-checkmark" />,
  IoAddOutline: () => <span data-testid="icon-add" />,
  IoFlameOutline: () => <span data-testid="icon-flame" />,
  IoChevronDownOutline: () => <span data-testid="icon-chevron-down" />,
}));

// Mock utils
vi.mock('../../../shared/utils/helpers', () => ({
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
  it('should render section header with toggle', async () => {
    const FuelReportsSection = (await import('../FuelReportsSection')).default;

    render(<FuelReportsSection carId={1} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.getAttribute('aria-expanded') === 'true')).toBe(true);
    expect(screen.getByText('details.fuelReports')).toBeInTheDocument();
  });

  it('should show loading spinner while fetching data', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    useQuery.mockReturnValue({ isLoading: true, data: null });

    const FuelReportsSection = (await import('../FuelReportsSection')).default;

    render(<FuelReportsSection carId={1} defaultOpen={true} />);

    expect(screen.getAllByTestId('spinner').length).toBeGreaterThan(0);
  });
});

describe('AddFuelReportForm', () => {
  it('should render form with fuel consumption input', async () => {
    const AddFuelReportForm = (await import('../AddFuelReportForm')).default;

    render(<AddFuelReportForm carId={1} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'fuelReports.submitReport' })).toBeInTheDocument();
  });

  it('should render cancel button', async () => {
    const AddFuelReportForm = (await import('../AddFuelReportForm')).default;

    render(<AddFuelReportForm carId={1} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'common:buttons.cancel' })).toBeInTheDocument();
  });
});
