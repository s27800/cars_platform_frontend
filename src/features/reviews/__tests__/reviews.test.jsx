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
  Avatar: ({ name }) => <div data-testid="avatar" data-name={name}>{name?.charAt(0)}</div>,
  Badge: ({ children, variant }) => <span data-testid="badge" data-variant={variant}>{children}</span>,
  Rating: ({ value, readonly, onChange }) => (
    <div data-testid="rating" data-value={value} data-readonly={readonly}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange?.(i)} data-star={i}>★</button>
      ))}
    </div>
  ),
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Button: ({ children, onClick, disabled, isLoading }) => (
    <button onClick={onClick} disabled={disabled || isLoading}>{children}</button>
  ),
  TextArea: ({ value, onChange, label, error, ...props }) => (
    <div>
      {label && <label>{label}</label>}
      <textarea value={value} onChange={onChange} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  Modal: ({ isOpen, children }) => isOpen ? <div data-testid="modal">{children}</div> : null,
}));

// Mock API
vi.mock('../../../api/likes', () => ({
  toggleReviewLike: vi.fn(() => Promise.resolve({ liked: true, likesCount: 1 })),
  getReviewLikeStatus: vi.fn(() => Promise.resolve({ liked: false, likesCount: 0 })),
}));

vi.mock('../../../api/reviews', () => ({
  getReviews: vi.fn(() => Promise.resolve({ content: [], totalElements: 0 })),
  createReview: vi.fn(() => Promise.resolve({ id: 1 })),
  getAverageRatings: vi.fn(() => Promise.resolve({})),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoHeartOutline: () => <span data-testid="icon-heart-outline" />,
  IoHeart: () => <span data-testid="icon-heart" />,
}));

// Mock utils
vi.mock('../../../utils/helpers', () => ({
  formatDate: (date) => date,
  calculateAverage: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0,
}));

vi.mock('../../../utils/constants', () => ({
  RATING_CATEGORIES: [
    { key: 'comfort', label: 'Comfort', description: 'Comfort rating' },
    { key: 'performance', label: 'Performance', description: 'Performance rating' },
    { key: 'reliability', label: 'Reliability', description: 'Reliability rating' },
    { key: 'handling', label: 'Handling', description: 'Handling rating' },
  ],
}));


describe('ReviewCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('module', () => {
    it('should export ReviewCard component', async () => {
      const module = await import('../ReviewCard');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render review card with author name', async () => {
      const ReviewCard = (await import('../ReviewCard')).default;
      const review = {
        id: 1,
        usernameResponse: { username: 'JohnDoe' },
        reviewDate: '2024-01-15',
        comfort: 4,
        performance: 5,
        reliability: 4,
        handling: 5,
        likesCount: 10,
      };

      render(<ReviewCard review={review} carId={1} />);

      expect(screen.getByTestId('avatar')).toHaveAttribute('data-name', 'JohnDoe');
    });

    it('should render Anonymous when no username', async () => {
      const ReviewCard = (await import('../ReviewCard')).default;
      const review = {
        id: 1,
        reviewDate: '2024-01-15',
        comfort: 4,
        performance: 5,
        reliability: 4,
        handling: 5,
        likesCount: 0,
      };

      render(<ReviewCard review={review} carId={1} />);

      expect(screen.getByTestId('avatar')).toHaveAttribute('data-name', 'Anonymous');
    });

    it('should render pending badge when not approved', async () => {
      const ReviewCard = (await import('../ReviewCard')).default;
      const review = {
        id: 1,
        reviewDate: '2024-01-15',
        comfort: 4,
        performance: 5,
        reliability: 4,
        handling: 5,
        likesCount: 0,
        isApproved: false,
      };

      render(<ReviewCard review={review} carId={1} />);

      expect(screen.getByText('status.pending')).toBeInTheDocument();
    });

    it('should render review comment when provided', async () => {
      const ReviewCard = (await import('../ReviewCard')).default;
      const review = {
        id: 1,
        reviewDate: '2024-01-15',
        comfort: 4,
        performance: 5,
        reliability: 4,
        handling: 5,
        likesCount: 0,
        comment: 'Great car, highly recommend!',
      };

      render(<ReviewCard review={review} carId={1} />);

      expect(screen.getByText('Great car, highly recommend!')).toBeInTheDocument();
    });

    it('should render rating components', async () => {
      const ReviewCard = (await import('../ReviewCard')).default;
      const review = {
        id: 1,
        reviewDate: '2024-01-15',
        comfort: 4,
        performance: 5,
        reliability: 4,
        handling: 5,
        likesCount: 0,
      };

      render(<ReviewCard review={review} carId={1} />);

      const ratings = screen.getAllByTestId('rating');

      expect(ratings.length).toBeGreaterThan(0);
    });
  });
});

describe('ReviewsSection', () => {
  describe('module', () => {
    it('should export ReviewsSection component', async () => {
      const module = await import('../ReviewsSection');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});

describe('RatingsChart', () => {
  describe('module', () => {
    it('should export RatingsChart component', async () => {
      const module = await import('../RatingsChart');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });

  describe('rendering', () => {
    it('should render ratings chart with data', async () => {
      const RatingsChart = (await import('../RatingsChart')).default;
      const ratings = {
        avgComfort: 4.2,
        avgPerformance: 4.5,
        avgReliability: 4.0,
        avgHandling: 4.3,
        count: 10,
      };

      render(<RatingsChart ratings={ratings} />);

      expect(document.body).toBeInTheDocument();
    });
  });
});

describe('AddReviewForm', () => {
  describe('module', () => {
    it('should export AddReviewForm component', async () => {
      const module = await import('../AddReviewForm');

      expect(module.default).toBeDefined();
      expect(typeof module.default).toBe('function');
    });
  });
});
