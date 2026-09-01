import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BrandsListPage from '../BrandsListPage';


const mockUseQuery = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args) => mockUseQuery(...args),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => params?.count !== undefined ? `${key} ${params.count}` : key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

vi.mock('../api', () => ({
  getBrands: vi.fn(),
}));

vi.mock('../../../shared/components/ui', () => ({
  Spinner: () => <div data-testid="spinner" />,
  Input: ({ value, onChange, placeholder, ...props }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} {...props} />
  ),
}));


const BRANDS = [
  { id: 'b3', name: 'Volkswagen', country: 'Germany', foundedYear: 1937 },
  { id: 'b1', name: 'Alfa Romeo', country: 'Italy', foundedYear: 1910 },
  { id: 'b2', name: 'Mazda', country: 'Japan', foundedYear: 1920 },
];

const renderPage = () => render(
  <MemoryRouter>
    <BrandsListPage />
  </MemoryRouter>
);

const brandLinks = () => screen.getAllByRole('link').filter(link => link.getAttribute('href') !== '/');


describe('BrandsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: BRANDS, isLoading: false, isError: false });
    window.scrollTo = vi.fn();
  });


  describe('loading and error states', () => {
    it('should show a spinner while the brands are loading', () => {
      mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });

      renderPage();

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should show an error message when the request failed', () => {
      mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });

      renderPage();

      expect(screen.getByText('errorTitle')).toBeInTheDocument();
      expect(screen.getByText('errorDescription')).toBeInTheDocument();
    });

    it('should not show the grid while loading', () => {
      mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });

      renderPage();

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });


  describe('rendering the brands', () => {
    it('should list every brand', () => {
      renderPage();

      expect(brandLinks()).toHaveLength(3);
    });

    it('should sort the brands alphabetically', () => {
      renderPage();

      const links = brandLinks();

      expect(links[0]).toHaveTextContent('Alfa Romeo');
      expect(links[1]).toHaveTextContent('Mazda');
      expect(links[2]).toHaveTextContent('Volkswagen');
    });

    it('should link each brand to its details page', () => {
      renderPage();

      expect(brandLinks()[0]).toHaveAttribute('href', '/brands/b1');
    });

    it('should count the brands in the subtitle', () => {
      renderPage();

      expect(screen.getByText('subtitle 3')).toBeInTheDocument();
    });

    it('should show the country and the founding year', () => {
      renderPage();

      const alfa = brandLinks()[0];

      expect(within(alfa).getByText('Italy')).toBeInTheDocument();
      expect(within(alfa).getByText(/1910/)).toBeInTheDocument();
    });

    it('should show the logo when the brand has one', () => {
      mockUseQuery.mockReturnValue({
        data: [{ id: 'b1', name: 'Mazda', logoUrl: 'https://cdn.example/mazda.png' }],
        isLoading: false,
        isError: false,
      });

      renderPage();

      expect(screen.getByAltText('Mazda logo')).toHaveAttribute('src', 'https://cdn.example/mazda.png');
    });

    it('should fall back to the initials when the brand has no logo', () => {
      renderPage();

      expect(screen.getByText('AR')).toBeInTheDocument();
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('should keep the initials to two letters', () => {
      mockUseQuery.mockReturnValue({
        data: [{ id: 'b1', name: 'Rolls Royce Motor Cars' }],
        isLoading: false,
        isError: false,
      });

      renderPage();

      expect(screen.getByText('RR')).toBeInTheDocument();
    });

    it('should tolerate a brand without a country or a founding year', () => {
      mockUseQuery.mockReturnValue({
        data: [{ id: 'b1', name: 'Mazda' }],
        isLoading: false,
        isError: false,
      });

      renderPage();

      expect(brandLinks()[0]).toHaveTextContent('Mazda');
    });

    it('should show the empty state when there are no brands at all', () => {
      mockUseQuery.mockReturnValue({ data: [], isLoading: false, isError: false });

      renderPage();

      expect(screen.getByText('noBrands')).toBeInTheDocument();
    });
  });


  describe('search', () => {
    const search = (query) => {
      fireEvent.change(screen.getByPlaceholderText('searchPlaceholder'), { target: { value: query } });
    };

    it('should narrow the list down to the matching brand name', () => {
      renderPage();

      search('mazda');

      const links = brandLinks();

      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('Mazda');
    });

    it('should match a name regardless of case', () => {
      renderPage();

      search('VOLKSWAGEN');

      expect(brandLinks()).toHaveLength(1);
    });

    it('should match on a part of the name', () => {
      renderPage();

      search('romeo');

      expect(brandLinks()[0]).toHaveTextContent('Alfa Romeo');
    });

    it('should match on the country too', () => {
      renderPage();

      search('japan');

      expect(brandLinks()[0]).toHaveTextContent('Mazda');
    });

    it('should show the empty state when nothing matches', () => {
      renderPage();

      search('Tesla');

      expect(screen.getByText('noBrands')).toBeInTheDocument();
      expect(brandLinks()).toHaveLength(0);
    });

    it('should ignore a query of only whitespace', () => {
      renderPage();

      search('   ');

      expect(brandLinks()).toHaveLength(3);
    });

    it('should bring every brand back when the query is cleared', () => {
      renderPage();

      search('mazda');
      search('');

      expect(brandLinks()).toHaveLength(3);
    });

    it('should keep counting all brands in the subtitle while filtering', () => {
      renderPage();

      search('mazda');

      expect(screen.getByText('subtitle 3')).toBeInTheDocument();
    });

    it('should tolerate a brand without a country', () => {
      mockUseQuery.mockReturnValue({
        data: [{ id: 'b1', name: 'Mazda' }, { id: 'b2', name: 'Alfa Romeo', country: 'Italy' }],
        isLoading: false,
        isError: false,
      });

      renderPage();

      search('italy');

      expect(brandLinks()).toHaveLength(1);
    });
  });
});
