import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';


// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));


// Mock hooks
const mockLogout = vi.fn();
const mockToggleTheme = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../../shared/hooks', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    logout: mockLogout,
  }),
  useTheme: () => ({
    isDark: false,
    toggleTheme: mockToggleTheme,
  }),
  useLanguage: () => ({
    language: 'en',
    changeLanguage: vi.fn(),
    availableLanguages: [{ code: 'en', name: 'English' }],
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Button: ({ children, onClick, to }) =>
    to ? <a href={to}>{children}</a> : <button onClick={onClick}>{children}</button>,
  NavLink: ({ children, to, isActive }) => (
    <a href={to} data-active={isActive}>{children}</a>
  ),
  Avatar: ({ name }) => <div data-testid="avatar">{name}</div>,
  Dropdown: ({ isOpen, children }) => isOpen ? <div data-testid="dropdown">{children}</div> : null,
  IconButton: ({ children, onClick, label, ...props }) => (
    <button onClick={onClick} aria-label={label} {...props}>{children}</button>
  ),
  LanguageSwitcher: () => <div data-testid="language-switcher">Lang</div>,
  Flag: ({ code }) => <span data-testid={`flag-${code}`} />,
}));

vi.mock('../../../features/cars', () => ({
  GlobalSearch: ({ onSearchSubmit }) => (
    <input data-testid="global-search" onChange={() => onSearchSubmit?.()} />
  ),
}));


// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render navigation element', () => {
      renderWithRouter(<Header />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render brand logo/name', () => {
      renderWithRouter(<Header />);

      expect(screen.getByText('CarsPlatform')).toBeInTheDocument();
    });

    it('should render home link', () => {
      renderWithRouter(<Header />);

      const homeLink = screen.getByRole('link', { name: 'a11y.homeLink' });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have aria-label for navigation', () => {
      renderWithRouter(<Header />);

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'a11y.mainNavigation');
    });
  });

  describe('navigation links', () => {
    it('should render cars link', () => {
      renderWithRouter(<Header />);

      expect(screen.getByText('navigation.cars')).toBeInTheDocument();
    });

    it('should render comparison link', () => {
      renderWithRouter(<Header />);

      expect(screen.getByText('navigation.comparison')).toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('should render global search', () => {
      renderWithRouter(<Header />);

      expect(screen.getByTestId('global-search')).toBeInTheDocument();
    });
  });

  describe('language switcher', () => {
    it('should render language switcher', () => {
      renderWithRouter(<Header />);

      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });
  });

  describe('mobile menu', () => {
    it('should render mobile menu toggle button', () => {
      renderWithRouter(<Header />);

      const menuButton = screen.getByRole('button', { name: 'a11y.openMenu' });

      expect(menuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu on button click', () => {
      renderWithRouter(<Header />);

      const menuButton = screen.getByRole('button', { name: 'a11y.openMenu' });
      fireEvent.click(menuButton);

      expect(screen.getByRole('button', { name: 'a11y.closeMenu' })).toBeInTheDocument();
    });
  });
});
