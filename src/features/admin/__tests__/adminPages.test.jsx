import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useLocation: () => ({ pathname: '/admin', search: '', state: null }),
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Redirecting...</div>,
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    refetch: vi.fn(),
  })),
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
  useAuth: vi.fn(() => ({
    user: { id: 1, username: 'admin', isAdmin: true },
    isAuthenticated: true,
    isAdmin: true,
    isLoading: false,
  })),
  useToast: () => ({ addToast: vi.fn() }),
}));

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  Button: ({ children, onClick, variant }) => <button onClick={onClick} data-variant={variant}>{children}</button>,
  Badge: ({ children, variant }) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Pagination: ({ currentPage, totalPages }) => <div data-testid="pagination">{currentPage}/{totalPages}</div>,
  TableSkeleton: () => <div data-testid="table-skeleton">Loading table...</div>,
  Modal: ({ isOpen, children }) => isOpen ? <div data-testid="modal">{children}</div> : null,
  Select: ({ label, options, value, onChange }) => (
    <select value={value} onChange={onChange} data-testid={`select-${label}`}>
      {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  ),
  Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
  Rating: ({ value }) => <div data-testid="rating" data-value={value}>{value}</div>,
  TextArea: ({ label, value, onChange }) => <textarea data-testid={`textarea-${label}`} value={value} onChange={onChange} />,
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoDocumentTextOutline: () => <span data-testid="icon" />,
  IoSpeedometerOutline: () => <span data-testid="icon" />,
  IoCreateOutline: () => <span data-testid="icon" />,
  IoChevronForwardOutline: () => <span data-testid="icon" />,
  IoShieldCheckmarkOutline: () => <span data-testid="icon" />,
  IoArrowBackOutline: () => <span data-testid="icon" />,
  IoCarSportOutline: () => <span data-testid="icon" />,
  IoCheckmarkCircleOutline: () => <span data-testid="icon" />,
  IoCloseCircleOutline: () => <span data-testid="icon" />,
  IoTimeOutline: () => <span data-testid="icon" />,
  IoPersonOutline: () => <span data-testid="icon" />,
  IoCalendarOutline: () => <span data-testid="icon" />,
  IoChevronDownOutline: () => <span data-testid="icon" />,
  IoHeartOutline: () => <span data-testid="icon" />,
  IoStarOutline: () => <span data-testid="icon" />,
  IoAlertCircleOutline: () => <span data-testid="icon" />,
}));

// Mock admin API
vi.mock('../api', () => ({
  getAdminStats: vi.fn(() => Promise.resolve({ proposals: 5, reviews: 10, fuelReports: 15 })),
  getPendingProposals: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  getPendingReviews: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  getPendingFuelReports: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  approveProposal: vi.fn(() => Promise.resolve()),
  rejectProposal: vi.fn(() => Promise.resolve()),
  approveReview: vi.fn(() => Promise.resolve()),
  rejectReview: vi.fn(() => Promise.resolve()),
  approveFuelReport: vi.fn(() => Promise.resolve()),
  rejectFuelReport: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../dataProposals/api', () => ({
  getPendingProposals: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
}));

vi.mock('../../reviews', () => ({
  RATING_CATEGORIES: [
    { key: 'comfort', labelKey: 'comfort' },
    { key: 'performance', labelKey: 'performance' },
  ],
}));

vi.mock('../../../shared/utils/helpers', () => ({
  formatDate: (date) => date,
  calculateAverage: (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
}));


describe('AdminDashboard', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render dashboard title for admin users', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminDashboard = (await import('../AdminDashboardPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminDashboard />);

      expect(screen.getByText('dashboard.title')).toBeInTheDocument();
    });

    it('should render stat cards', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminDashboard = (await import('../AdminDashboardPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminDashboard />);

      expect(screen.getAllByText('dashboard.stats.pendingReviews').length).toBeGreaterThan(0);
      expect(screen.getAllByText('dashboard.stats.pendingFuelReports').length).toBeGreaterThan(0);
      expect(screen.getAllByText('dashboard.stats.pendingDataProposals').length).toBeGreaterThan(0);
    });
  });
});

describe('AdminProposalsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render page title', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminProposalsPage = (await import('../AdminProposalsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminProposalsPage />);

      expect(screen.getAllByText(/proposals\.title/i).length).toBeGreaterThan(0);
    });

    it('should render back to dashboard link', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminProposalsPage = (await import('../AdminProposalsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminProposalsPage />);

      expect(screen.getAllByText('proposals.backToDashboard').length).toBeGreaterThan(0);
    });
  });
});

describe('AdminReviewsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render page title', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminReviewsPage = (await import('../AdminReviewsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminReviewsPage />);

      expect(screen.getAllByText('reviews.title').length).toBeGreaterThan(0);
    });

    it('should render back to dashboard link', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminReviewsPage = (await import('../AdminReviewsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminReviewsPage />);

      expect(screen.getAllByText('reviews.backToDashboard').length).toBeGreaterThan(0);
    });
  });
});

describe('AdminFuelReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render page title', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminFuelReportsPage = (await import('../AdminFuelReportsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminFuelReportsPage />);

      expect(screen.getAllByText('fuelReports.title').length).toBeGreaterThan(0);
    });

    it('should render back to dashboard link', async () => {
      const { useAuth } = await import('../../../shared/hooks');

      useAuth.mockReturnValue({
        user: { id: 1, username: 'admin', isAdmin: true },
        isAuthenticated: true,
        isAdmin: true,
        isLoading: false,
      });

      const AdminFuelReportsPage = (await import('../AdminFuelReportsPage')).default;
      const { render, screen } = await import('@testing-library/react');

      render(<AdminFuelReportsPage />);

      expect(screen.getAllByText('fuelReports.backToDashboard').length).toBeGreaterThan(0);
    });
  });
});
