import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, ThemeContext } from '../ThemeContext';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';


// Mock userSettings API
vi.mock('../../api/userSettings', () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));


// Test component to access context
const TestConsumer = () => {
  const context = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme">{context.theme}</span>
      <span data-testid="is-dark">{context.isDark.toString()}</span>
      <span data-testid="is-loading">{context.isLoading.toString()}</span>
      <span data-testid="is-syncing">{context.isSyncing.toString()}</span>
      <button onClick={context.toggleTheme} data-testid="toggle-theme">
        Toggle
      </button>
      <button onClick={() => context.setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => context.setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => context.setTheme('invalid')} data-testid="set-invalid">
        Set Invalid
      </button>
    </div>
  );
};


// Wrapper with AuthContext and a throwaway query client
const renderWithAuth = (ui, { isAuthenticated = false } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated }}>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};


describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    document.documentElement.classList.remove('dark');
  });

  describe('ThemeProvider', () => {
    it('should render children', () => {
      renderWithAuth(<div data-testid="child">Child content</div>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should default to light theme when no stored preference', () => {
      localStorage.getItem.mockReturnValue(null);

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });

    it('should use stored theme from localStorage', () => {
      localStorage.getItem.mockReturnValue('dark');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should apply dark class to document when dark theme', () => {
      localStorage.getItem.mockReturnValue('dark');

      renderWithAuth(<TestConsumer />);

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from document when light theme', () => {
      document.documentElement.classList.add('dark');
      localStorage.getItem.mockReturnValue('light');

      renderWithAuth(<TestConsumer />);

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should change theme to dark', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue('light');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      await user.click(screen.getByTestId('set-dark'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should change theme to light', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue('dark');

      renderWithAuth(<TestConsumer />);

      await user.click(screen.getByTestId('set-light'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should not change theme for invalid value', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue('light');

      renderWithAuth(<TestConsumer />);

      await user.click(screen.getByTestId('set-invalid'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue('light');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      await user.click(screen.getByTestId('toggle-theme'));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should toggle from dark to light', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue('dark');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      await user.click(screen.getByTestId('toggle-theme'));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('isDark computed property', () => {
    it('should be true when theme is dark', () => {
      localStorage.getItem.mockReturnValue('dark');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    });

    it('should be false when theme is light', () => {
      localStorage.getItem.mockReturnValue('light');

      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });
  });

  describe('THEMES constant', () => {
    it('should expose THEMES constant', () => {
      const ThemesConsumer = () => {
        const { THEMES } = useContext(ThemeContext);
        return (
          <div>
            <span data-testid="themes-light">{THEMES.LIGHT}</span>
            <span data-testid="themes-dark">{THEMES.DARK}</span>
          </div>
        );
      };

      renderWithAuth(<ThemesConsumer />);

      expect(screen.getByTestId('themes-light')).toHaveTextContent('light');
      expect(screen.getByTestId('themes-dark')).toHaveTextContent('dark');
    });
  });
});
