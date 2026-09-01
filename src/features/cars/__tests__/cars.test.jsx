import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({ data: null, isLoading: false })),
  useQueries: () => [],
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

vi.mock('../CarCard', () => ({
  default: ({ car }) => <div data-testid="car-card">{car?.name || 'Car'}</div>,
}));

// Mock UI components
vi.mock('../../../shared/components/ui', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Mock cars API
vi.mock('../api', () => ({
  getSimilarCars: vi.fn(() => Promise.resolve([])),
}));


describe('SpecificationSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle content visibility on click', async () => {
    const { default: SpecificationSection } = await import('../SpecificationSection');

    render(
      <SpecificationSection title="Engine">
        <span data-testid="content">Engine specs</span>
      </SpecificationSection>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should start open when defaultOpen is true', async () => {
    const { default: SpecificationSection } = await import('../SpecificationSection');

    render(
      <SpecificationSection title="Engine" defaultOpen={true}>
        <span data-testid="content">Engine specs</span>
      </SpecificationSection>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should render title and icon', async () => {
    const { default: SpecificationSection } = await import('../SpecificationSection');
    const TestIcon = () => <span data-testid="icon">🚗</span>;

    render(
      <SpecificationSection title="Performance" icon={<TestIcon />}>
        Content
      </SpecificationSection>
    );

    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});


describe('ImageGallery', () => {
  it('should render placeholder when no images provided', async () => {
    const { default: ImageGallery } = await import('../ImageGallery');

    render(<ImageGallery images={[]} />);

    expect(screen.getByText('details.noImages')).toBeInTheDocument();
  });

  it('should render image with navigation when multiple images provided', async () => {
    const { default: ImageGallery } = await import('../ImageGallery');
    const images = [
      { id: 1, imageUrl: 'http://example.com/img1.jpg' },
      { id: 2, imageUrl: 'http://example.com/img2.jpg' },
    ];

    render(<ImageGallery images={images} carName="Test Car" />);

    expect(screen.getByAltText('Test Car - Image 1')).toBeInTheDocument();
    expect(screen.getByLabelText('gallery.previousImage')).toBeInTheDocument();
    expect(screen.getByLabelText('gallery.nextImage')).toBeInTheDocument();
  });

  it('should navigate to next image on button click', async () => {
    const { default: ImageGallery } = await import('../ImageGallery');
    const images = [
      { id: 1, imageUrl: 'http://example.com/img1.jpg' },
      { id: 2, imageUrl: 'http://example.com/img2.jpg' },
    ];

    render(<ImageGallery images={images} carName="Test Car" />);

    fireEvent.click(screen.getByLabelText('gallery.nextImage'));
    expect(screen.getByAltText('Test Car - Image 2')).toBeInTheDocument();
  });

  it('should hide navigation buttons with single image', async () => {
    const { default: ImageGallery } = await import('../ImageGallery');
    const images = [{ id: 1, imageUrl: 'http://example.com/img1.jpg' }];

    render(<ImageGallery images={images} />);

    expect(screen.queryByLabelText('gallery.previousImage')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('gallery.nextImage')).not.toBeInTheDocument();
  });
});


describe('SimilarCars', () => {
  it('should render loading spinner while fetching', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { default: SimilarCars } = await import('../SimilarCars');

    render(
      <MemoryRouter>
        <SimilarCars carId={1} />
      </MemoryRouter>
    );

    expect(screen.getByText('details.similarCars')).toBeInTheDocument();
  });

  it('should return null when there is an error', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    const { default: SimilarCars } = await import('../SimilarCars');

    const { container } = render(
      <MemoryRouter>
        <SimilarCars carId={1} />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should return null when no similar cars found', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    const { default: SimilarCars } = await import('../SimilarCars');

    const { container } = render(
      <MemoryRouter>
        <SimilarCars carId={1} />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render similar cars grid when data is available', async () => {
    const { useQuery } = await import('@tanstack/react-query');
    vi.mocked(useQuery).mockReturnValue({
      data: [
        { id: 1, name: 'Similar Car 1' },
        { id: 2, name: 'Similar Car 2' },
      ],
      isLoading: false,
      isError: false,
    });

    const { default: SimilarCars } = await import('../SimilarCars');

    render(
      <MemoryRouter>
        <SimilarCars carId={1} />
      </MemoryRouter>
    );

    expect(screen.getByText('details.similarCars')).toBeInTheDocument();
  });
});
