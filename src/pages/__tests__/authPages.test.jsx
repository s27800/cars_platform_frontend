import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useLocation: () => ({ pathname: '/', search: '', state: null }),
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Redirecting...</div>,
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useMutation: vi.fn(() => ({ 
    mutate: vi.fn(), 
    isPending: false,
    mutateAsync: vi.fn(),
  })),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

// Mock react-i18next with all required exports
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// Mock hooks
vi.mock('../../hooks', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    error: null,
    isLoading: false,
    clearError: vi.fn(),
  })),
  useToast: () => ({ addToast: vi.fn() }),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoLockClosedOutline: () => <span data-testid="icon" />,
  IoPersonOutline: () => <span data-testid="icon" />,
  IoEyeOutline: () => <span data-testid="icon" />,
  IoEyeOffOutline: () => <span data-testid="icon" />,
  IoMailOutline: () => <span data-testid="icon" />,
  IoAtOutline: () => <span data-testid="icon" />,
  IoCalendarOutline: () => <span data-testid="icon" />,
  IoShieldCheckmarkOutline: () => <span data-testid="icon" />,
  IoCarSportOutline: () => <span data-testid="icon" />,
  IoSpeedometerOutline: () => <span data-testid="icon" />,
  IoDocumentTextOutline: () => <span data-testid="icon" />,
  IoCreateOutline: () => <span data-testid="icon" />,
  IoSettingsOutline: () => <span data-testid="icon" />,
  IoKeyOutline: () => <span data-testid="icon" />,
  IoLogOutOutline: () => <span data-testid="icon" />,
  IoPencilOutline: () => <span data-testid="icon" />,
  IoArrowBackOutline: () => <span data-testid="icon" />,
  IoListOutline: () => <span data-testid="icon" />,
  IoCheckmarkCircle: () => <span data-testid="icon" />,
  IoCloseCircle: () => <span data-testid="icon" />,
  IoTimeOutline: () => <span data-testid="icon" />,
}));

// Mock profile features
vi.mock('../../features/profile', () => ({
  ProfileInfo: () => <div data-testid="profile-info">Profile Info</div>,
  ProfileEditForm: () => <div data-testid="profile-edit-form">Edit Form</div>,
  PasswordChangeForm: () => <div data-testid="password-change-form">Password Form</div>,
  UserReviewsList: () => <div data-testid="user-reviews">Reviews</div>,
  UserFuelReportsList: () => <div data-testid="user-fuel-reports">Fuel Reports</div>,
  UserDataProposalsList: () => <div data-testid="user-proposals">Proposals</div>,
}));

// Mock users API
vi.mock('../../api/users', () => ({
  getProfile: vi.fn(() => Promise.resolve({ id: 1, username: 'testuser', email: 'test@example.com' })),
  updateProfile: vi.fn(() => Promise.resolve()),
  changePassword: vi.fn(() => Promise.resolve()),
}));

// Mock UI components
vi.mock('../../components/ui', () => ({
  Input: ({ label, value, onChange, error, type, ...props }) => (
    <div>
      {label && <label htmlFor={label}>{label}</label>}
      <input id={label} type={type} value={value} onChange={onChange} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  Button: ({ children, onClick, type, disabled, isLoading }) => (
    <button onClick={onClick} type={type} disabled={disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Alert: ({ children, variant }) => <div data-testid={`alert-${variant}`}>{children}</div>,
  Tabs: ({ children }) => <div data-testid="tabs">{children}</div>,
}));


describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module', () => {
    it('should export LoginPage component', async () => {
      const module = await import('../LoginPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render login form', async () => {
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      expect(screen.getByText('login.title')).toBeInTheDocument();
    });

    it('should render username and password inputs', async () => {
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      expect(screen.getByLabelText('login.username')).toBeInTheDocument();
      expect(screen.getByLabelText('login.password')).toBeInTheDocument();
    });

    it('should render submit button', async () => {
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      expect(screen.getByRole('button', { name: 'login.submit' })).toBeInTheDocument();
    });

    it('should render link to register page', async () => {
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      expect(screen.getByText(/login.noAccount/)).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('should allow entering username', async () => {
      const user = userEvent.setup();
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      const usernameInput = screen.getByLabelText('login.username');
      await user.type(usernameInput, 'testuser');
      
      expect(usernameInput.value).toBe('testuser');
    });

    it('should allow entering password', async () => {
      const user = userEvent.setup();
      const LoginPage = (await import('../LoginPage')).default;
      
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText('login.password');
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput.value).toBe('password123');
    });
  });
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module', () => {
    it('should export RegisterPage component', async () => {
      const module = await import('../RegisterPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render register form', async () => {
      const RegisterPage = (await import('../RegisterPage')).default;
      
      render(<RegisterPage />);
      
      expect(screen.getByText('register.title')).toBeInTheDocument();
    });

    it('should render all required fields', async () => {
      const RegisterPage = (await import('../RegisterPage')).default;
      
      render(<RegisterPage />);
      
      expect(screen.getByLabelText('register.username')).toBeInTheDocument();
      expect(screen.getByLabelText('register.email')).toBeInTheDocument();
      expect(screen.getByLabelText('register.password')).toBeInTheDocument();
      expect(screen.getByLabelText('register.confirmPassword')).toBeInTheDocument();
    });

    it('should render submit button', async () => {
      const RegisterPage = (await import('../RegisterPage')).default;
      
      render(<RegisterPage />);
      
      expect(screen.getByRole('button', { name: 'register.submit' })).toBeInTheDocument();
    });

    it('should render link to login page', async () => {
      const RegisterPage = (await import('../RegisterPage')).default;
      
      render(<RegisterPage />);
      
      expect(screen.getByText(/register.hasAccount/)).toBeInTheDocument();
    });
  });
});

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module', () => {
    it('should export ProfilePage component', async () => {
      const module = await import('../ProfilePage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should redirect unauthenticated users', async () => {
      const { useAuth } = await import('../../hooks');
      
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      const ProfilePage = (await import('../ProfilePage')).default;

      render(<ProfilePage />);
      
      expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    it('should render loading spinner when auth is loading', async () => {
      const { useAuth } = await import('../../hooks');

      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
      });

      const ProfilePage = (await import('../ProfilePage')).default;

      render(<ProfilePage />);
      
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});
