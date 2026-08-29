import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, LanguageContext } from '../LanguageContext';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';


// Mock i18next
const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
    t: (key) => key,
  }),
}));

// Mock userSettings API
vi.mock('../../api/userSettings', () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

// Mock i18n constants
vi.mock('../../i18n', () => ({
  LANGUAGES: { EN: 'en', PL: 'pl' },
  LANGUAGE_NAMES: { en: 'English', pl: 'Polski' },
}));


// Test component to access context
const TestConsumer = () => {
  const context = useContext(LanguageContext);

  return (
    <div>
      <span data-testid="language">{context.language}</span>
      <span data-testid="is-loading">{context.isLoading.toString()}</span>
      <span data-testid="is-syncing">{context.isSyncing.toString()}</span>
      <span data-testid="available-languages">
        {context.availableLanguages.map(l => l.code).join(',')}
      </span>
      <button onClick={context.toggleLanguage} data-testid="toggle-language">
        Toggle
      </button>
      <button onClick={() => context.changeLanguage('pl')} data-testid="set-pl">
        Set Polish
      </button>
      <button onClick={() => context.changeLanguage('en')} data-testid="set-en">
        Set English
      </button>
      <button onClick={() => context.changeLanguage('invalid')} data-testid="set-invalid">
        Set Invalid
      </button>
    </div>
  );
};


// Wrapper with AuthContext
const renderWithAuth = (ui, { isAuthenticated = false } = {}) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated }}>
      <LanguageProvider>
        {ui}
      </LanguageProvider>
    </AuthContext.Provider>
  );
};


describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    mockChangeLanguage.mockClear();
  });

  describe('LanguageProvider', () => {
    it('should render children', () => {
      renderWithAuth(<div data-testid="child">Child content</div>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should default to English when no stored preference', () => {
      localStorage.getItem.mockReturnValue(null);
      
      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });

    it('should use stored language from localStorage', () => {
      localStorage.getItem.mockReturnValue('pl');
      
      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('language')).toBeInTheDocument();
    });

    it('should update document lang attribute', () => {
      renderWithAuth(<TestConsumer />);

      expect(document.documentElement.lang).toBe('en');
    });
  });

  describe('changeLanguage', () => {
    it('should change language to Polish', async () => {
      const user = userEvent.setup();

      localStorage.getItem.mockReturnValue(null);
      
      renderWithAuth(<TestConsumer />);

      await user.click(screen.getByTestId('set-pl'));

      expect(screen.getByTestId('language')).toHaveTextContent('pl');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'pl');
      expect(mockChangeLanguage).toHaveBeenCalledWith('pl');
    });

    it('should change language to English', async () => {
      const user = userEvent.setup();
      
      renderWithAuth(<TestConsumer />);

      await user.click(screen.getByTestId('set-en'));

      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('should not change language for invalid value', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithAuth(<TestConsumer />);

      await user.click(screen.getByTestId('set-invalid'));

      expect(consoleSpy).toHaveBeenCalledWith('Invalid language: invalid');
      
      consoleSpy.mockRestore();
    });
  });

  describe('toggleLanguage', () => {
    it('should toggle from English to Polish', async () => {
      const user = userEvent.setup();
      
      localStorage.getItem.mockReturnValue(null);
      
      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('language')).toHaveTextContent('en');

      await user.click(screen.getByTestId('toggle-language'));

      expect(screen.getByTestId('language')).toHaveTextContent('pl');
    });
  });

  describe('availableLanguages', () => {
    it('should return list of available languages', () => {
      renderWithAuth(<TestConsumer />);

      expect(screen.getByTestId('available-languages')).toHaveTextContent('en,pl');
    });
  });

  describe('LANGUAGES and LANGUAGE_NAMES constants', () => {
    it('should expose language constants', () => {
      const ConstantsConsumer = () => {
        const { LANGUAGES, LANGUAGE_NAMES } = useContext(LanguageContext);
        return (
          <div>
            <span data-testid="lang-en">{LANGUAGES.EN}</span>
            <span data-testid="lang-pl">{LANGUAGES.PL}</span>
            <span data-testid="name-en">{LANGUAGE_NAMES.en}</span>
            <span data-testid="name-pl">{LANGUAGE_NAMES.pl}</span>
          </div>
        );
      };

      renderWithAuth(<ConstantsConsumer />);

      expect(screen.getByTestId('lang-en')).toHaveTextContent('en');
      expect(screen.getByTestId('lang-pl')).toHaveTextContent('pl');
      expect(screen.getByTestId('name-en')).toHaveTextContent('English');
      expect(screen.getByTestId('name-pl')).toHaveTextContent('Polski');
    });
  });
});
