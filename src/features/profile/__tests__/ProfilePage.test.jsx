import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../ProfilePage';


const mockNavigate = vi.fn();
const mockInvalidateQueries = vi.fn();
let currentPath = '/profile';

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: currentPath }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

let queryState;

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => queryState,
  useMutation: () => ({ mutateAsync: vi.fn(), isPending: false, error: null }),
  useQueryClient: () => ({ setQueryData: vi.fn(), invalidateQueries: mockInvalidateQueries }),
}));

vi.mock('../../../shared/hooks', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, username: 'testuser', email: 'test@example.com' },
    updateUser: vi.fn(),
  }),
}));

vi.mock('../api', () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
}));

vi.mock('../../../shared/components/ui', () => {
  const TabsContext = { value: 'profile', onChange: () => {} };

  const Tabs = ({ value, onChange, children }) => {
    TabsContext.value = value;
    TabsContext.onChange = onChange;

    return <div data-testid="tabs" data-value={value}>{children}</div>;
  };

  Tabs.List = ({ children }) => <div role="tablist">{children}</div>;
  Tabs.Trigger = ({ value, children }) => (
    <button role="tab" data-value={value} onClick={() => TabsContext.onChange(value)}>{children}</button>
  );
  Tabs.Content = ({ value, children }) => (
    TabsContext.value === value ? <div data-testid={`panel-${value}`}>{children}</div> : null
  );

  return {
    Tabs,
    Card: ({ children }) => <div data-testid="card">{children}</div>,
    Spinner: () => <div data-testid="spinner" />,
    Button: ({ children, onClick, to }) => (
      to ? <a href={to}>{children}</a> : <button onClick={onClick}>{children}</button>
    ),
  };
});

vi.mock('../ProfileInfo', () => ({ default: () => <div data-testid="profile-info" /> }));
vi.mock('../ProfileEditForm', () => ({ default: () => <div data-testid="profile-edit-form" /> }));
vi.mock('../PasswordChangeForm', () => ({ default: () => <div data-testid="password-form" /> }));
vi.mock('../UserReviewsList', () => ({ default: () => <div data-testid="reviews-list" /> }));
vi.mock('../UserFuelReportsList', () => ({ default: () => <div data-testid="reports-list" /> }));
vi.mock('../UserDataProposalsList', () => ({ default: () => <div data-testid="proposals-list" /> }));
vi.mock('../DeleteAccountSection', () => ({ default: () => <div data-testid="delete-account" /> }));

vi.mock('react-icons/io5', () => ({
  IoPencilOutline: () => <span data-testid="icon" />,
  IoLockClosedOutline: () => <span data-testid="icon" />,
  IoArrowBackOutline: () => <span data-testid="icon" />,
  IoDocumentTextOutline: () => <span data-testid="icon" />,
  IoSpeedometerOutline: () => <span data-testid="icon" />,
  IoCreateOutline: () => <span data-testid="icon" />,
  IoListOutline: () => <span data-testid="icon" />,
}));


const PROFILE = { id: 1, username: 'testuser', email: 'test@example.com' };

const renderAt = (path) => {
  currentPath = path;

  return render(<ProfilePage />);
};


describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryState = { data: PROFILE, isLoading: false, error: null };
  });


  describe('loading and error states', () => {
    it('should show a spinner while the profile is loading', () => {
      queryState = { data: undefined, isLoading: true, error: null };

      renderAt('/profile');

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-info')).not.toBeInTheDocument();
    });

    it('should show an error message when the profile could not be loaded', () => {
      queryState = { data: undefined, isLoading: false, error: new Error('boom') };

      renderAt('/profile');

      expect(screen.getByText('loadError')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-info')).not.toBeInTheDocument();
    });

    it('should refetch the profile when retry is pressed', () => {
      queryState = { data: undefined, isLoading: false, error: new Error('boom') };

      renderAt('/profile');
      fireEvent.click(screen.getByRole('button', { name: 'retry' }));

      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', 'profile'] });
    });

    it('should not show the error while still loading', () => {
      queryState = { data: undefined, isLoading: true, error: new Error('boom') };

      renderAt('/profile');

      expect(screen.queryByText('loadError')).not.toBeInTheDocument();
    });

    it('should fall back to the logged-in user when the profile request returned nothing', () => {
      queryState = { data: undefined, isLoading: false, error: null };

      renderAt('/profile');

      expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });
  });


  describe('tab selected by the URL', () => {
    it('should open the edit tab on /profile', () => {
      renderAt('/profile');

      expect(screen.getByTestId('tabs')).toHaveAttribute('data-value', 'profile');
      expect(screen.getByTestId('profile-edit-form')).toBeInTheDocument();
    });

    it('should open the password tab on /profile/password', () => {
      renderAt('/profile/password');

      expect(screen.getByTestId('tabs')).toHaveAttribute('data-value', 'password');
      expect(screen.getByTestId('password-form')).toBeInTheDocument();
    });

    it('should open the activity tab on /profile/reviews', () => {
      renderAt('/profile/reviews');

      expect(screen.getByTestId('tabs')).toHaveAttribute('data-value', 'activity');
      expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
    });

    it('should show the fuel reports on /profile/reports', () => {
      renderAt('/profile/reports');

      expect(screen.getByTestId('reports-list')).toBeInTheDocument();
      expect(screen.queryByTestId('reviews-list')).not.toBeInTheDocument();
    });

    it('should show the proposals on /profile/proposals', () => {
      renderAt('/profile/proposals');

      expect(screen.getByTestId('proposals-list')).toBeInTheDocument();
      expect(screen.queryByTestId('reviews-list')).not.toBeInTheDocument();
    });

    it('should fall back to the edit tab for an unknown profile path', () => {
      renderAt('/profile/something-else');

      expect(screen.getByTestId('tabs')).toHaveAttribute('data-value', 'profile');
    });

    it('should offer account deletion on the edit tab only', () => {
      renderAt('/profile');

      expect(screen.getByTestId('delete-account')).toBeInTheDocument();
    });

    it('should not offer account deletion on the password tab', () => {
      renderAt('/profile/password');

      expect(screen.queryByTestId('delete-account')).not.toBeInTheDocument();
    });
  });


  describe('navigating between tabs', () => {
    it('should go to /profile when the edit tab is chosen', () => {
      renderAt('/profile/password');

      fireEvent.click(screen.getByRole('tab', { name: /tabs.editProfile/ }));

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should go to /profile/password when the password tab is chosen', () => {
      renderAt('/profile');

      fireEvent.click(screen.getByRole('tab', { name: /tabs.password/ }));

      expect(mockNavigate).toHaveBeenCalledWith('/profile/password');
    });

    it('should land on the reviews list when the activity tab is chosen', () => {
      renderAt('/profile');

      fireEvent.click(screen.getByRole('tab', { name: /tabs.activity/ }));

      expect(mockNavigate).toHaveBeenCalledWith('/profile/reviews');
    });

    it('should switch the activity type through the URL', () => {
      renderAt('/profile/reviews');

      fireEvent.click(screen.getByRole('button', { name: /activityTypes.reports/ }));

      expect(mockNavigate).toHaveBeenCalledWith('/profile/reports');
    });

    it('should offer every activity type', () => {
      renderAt('/profile/reviews');

      expect(screen.getByRole('button', { name: /activityTypes.reviews/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /activityTypes.reports/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /activityTypes.proposals/ })).toBeInTheDocument();
    });
  });
});
