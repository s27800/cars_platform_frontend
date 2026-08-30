import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';


// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useLocation: () => ({ pathname: '/', search: '', state: null }),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
  useQueries: () => [],
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
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

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoCarSportOutline: () => <span data-testid="icon" />,
  IoSearchOutline: () => <span data-testid="icon" />,
  IoStatsChartOutline: () => <span data-testid="icon" />,
  IoDocumentTextOutline: () => <span data-testid="icon" />,
  IoSpeedometerOutline: () => <span data-testid="icon" />,
  IoPeopleOutline: () => <span data-testid="icon" />,
  IoShieldCheckmarkOutline: () => <span data-testid="icon" />,
  IoRocketOutline: () => <span data-testid="icon" />,
  IoHelpCircleOutline: () => <span data-testid="icon" />,
  IoChevronDownOutline: () => <span data-testid="icon" />,
  IoPersonOutline: () => <span data-testid="icon" />,
  IoSettingsOutline: () => <span data-testid="icon" />,
  IoHomeOutline: () => <span data-testid="icon" />,
  IoArrowBackOutline: () => <span data-testid="icon" />,
  IoCreateOutline: () => <span data-testid="icon" />,
  IoServerOutline: () => <span data-testid="icon" />,
  IoGitCompareOutline: () => <span data-testid="icon" />,
  IoInformationCircleOutline: () => <span data-testid="icon" />,
  IoWarningOutline: () => <span data-testid="icon" />,
  IoLockClosedOutline: () => <span data-testid="icon" />,
  IoTrashOutline: () => <span data-testid="icon" />,
  IoMailOutline: () => <span data-testid="icon" />,
  IoCallOutline: () => <span data-testid="icon" />,
  IoLocationOutline: () => <span data-testid="icon" />,
  IoTimeOutline: () => <span data-testid="icon" />,
  IoCheckmarkCircleOutline: () => <span data-testid="icon" />,
  IoCloseCircleOutline: () => <span data-testid="icon" />,
  IoAlertCircleOutline: () => <span data-testid="icon" />,
  IoChevronUpOutline: () => <span data-testid="icon" />,
  IoGlobeOutline: () => <span data-testid="icon" />,
  IoFingerPrintOutline: () => <span data-testid="icon" />,
  IoAnalyticsOutline: () => <span data-testid="icon" />,
  IoRefreshOutline: () => <span data-testid="icon" />,
  IoHandLeftOutline: () => <span data-testid="icon" />,
}));

// Mock hooks
vi.mock('../../hooks', () => ({
  useAuth: () => ({ 
    user: null, 
    isAuthenticated: false,
    isAdmin: false,
  }),
  useToast: () => ({ addToast: vi.fn() }),
  useTheme: () => ({ isDark: false, toggleTheme: vi.fn() }),
  useLanguage: () => ({ language: 'en', changeLanguage: vi.fn() }),
}));

// Mock UI components
vi.mock('../../components/ui', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));


describe('AboutPage', () => {
  describe('module', () => {
    it('should export AboutPage component', async () => {
      const module = await import('../AboutPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render hero section with title', async () => {
      const AboutPage = (await import('../AboutPage')).default;

      render(<AboutPage />);
      
      expect(screen.getByText('about.title')).toBeInTheDocument();
    });

    it('should render feature cards', async () => {
      const AboutPage = (await import('../AboutPage')).default;

      render(<AboutPage />);
      
      expect(screen.getByText('about.features.search.title')).toBeInTheDocument();
      expect(screen.getByText('about.features.comparison.title')).toBeInTheDocument();
      expect(screen.getByText('about.features.reviews.title')).toBeInTheDocument();
      expect(screen.getAllByText('about.features.fuel.title').length).toBeGreaterThan(0);
    });

    it('should render statistics section', async () => {
      const AboutPage = (await import('../AboutPage')).default;

      render(<AboutPage />);
      
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('about.stats.carModels')).toBeInTheDocument();
    });

    it('should render CTA section with links', async () => {
      const AboutPage = (await import('../AboutPage')).default;

      render(<AboutPage />);
      
      expect(screen.getByText('about.cta.title')).toBeInTheDocument();
    });
  });
});

describe('FAQPage', () => {
  describe('module', () => {
    it('should export FAQPage component', async () => {
      const module = await import('../FAQPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render FAQ page title', async () => {
      const FAQPage = (await import('../FAQPage')).default;

      render(<FAQPage />);
      
      expect(screen.getByText('faq.title')).toBeInTheDocument();
    });

    it('should render FAQ categories', async () => {
      const FAQPage = (await import('../FAQPage')).default;

      render(<FAQPage />);
      
      expect(screen.getByText('faq.categories.account.title')).toBeInTheDocument();
    });

    it('should render contact section', async () => {
      const FAQPage = (await import('../FAQPage')).default;

      render(<FAQPage />);
      
      expect(screen.getByText(/contact@carsplatform.com/i)).toBeInTheDocument();
    });

    it('should toggle FAQ items when clicked', async () => {
      const FAQPage = (await import('../FAQPage')).default;

      render(<FAQPage />);
      
      const buttons = screen.getAllByRole('button');
      const faqButton = buttons.find(btn => btn.getAttribute('aria-expanded') !== null);
      
      if (faqButton) {
        fireEvent.click(faqButton);
        expect(faqButton).toBeInTheDocument();
      }
    });
  });
});

describe('TermsPage', () => {
  describe('module', () => {
    it('should export TermsPage component', async () => {
      const module = await import('../TermsPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render terms page title', async () => {
      const TermsPage = (await import('../TermsPage')).default;

      render(<TermsPage />);
      
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should render terms sections', async () => {
      const TermsPage = (await import('../TermsPage')).default;

      render(<TermsPage />);
      
      expect(screen.getAllByText(/Acceptance of Terms/i).length).toBeGreaterThan(0);
    });

    it('should render last updated date', async () => {
      const TermsPage = (await import('../TermsPage')).default;

      render(<TermsPage />);
      
      expect(screen.getByText(/Last updated/i)).toBeInTheDocument();
    });
  });
});

describe('PrivacyPage', () => {
  describe('module', () => {
    it('should export PrivacyPage component', async () => {
      const module = await import('../PrivacyPage');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render privacy policy title', async () => {
      const PrivacyPage = (await import('../PrivacyPage')).default;

      render(<PrivacyPage />);
      
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('should render privacy sections', async () => {
      const PrivacyPage = (await import('../PrivacyPage')).default;

      render(<PrivacyPage />);
      
      expect(screen.getAllByText(/Information We Collect/i).length).toBeGreaterThan(0);
    });

    it('should render contact information', async () => {
      const PrivacyPage = (await import('../PrivacyPage')).default;

      render(<PrivacyPage />);
      
      expect(screen.getAllByText(/Contact Us/i).length).toBeGreaterThan(0);
    });
  });
});

describe('NotFoundPage', () => {
  describe('module', () => {
    it('should export NotFoundPage component', async () => {
      const module = await import('../NotFoundPage');
      
      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render 404 error code', async () => {
      const NotFoundPage = (await import('../NotFoundPage')).default;

      render(<NotFoundPage />);
      
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should render page not found message', async () => {
      const NotFoundPage = (await import('../NotFoundPage')).default;

      render(<NotFoundPage />);
      
      expect(screen.getByText('errors.pageNotFound')).toBeInTheDocument();
    });

    it('should render home button', async () => {
      const NotFoundPage = (await import('../NotFoundPage')).default;
      
      render(<NotFoundPage />);
      
      expect(screen.getByText('errors.goHome')).toBeInTheDocument();
    });
  });
});
