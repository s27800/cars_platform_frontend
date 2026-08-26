import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CarCard from '../CarCard';


// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));


// Mock UI components
vi.mock('../../ui', () => ({
  Badge: ({ children, className }) => <span className={className}>{children}</span>,
  Button: ({ children, onClick, className, ...props }) => (
    <button className={className} onClick={onClick} {...props}>{children}</button>
  ),
}));


// Helper to wrap with Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('CarCard', () => {
  const mockCar = {
    id: 1,
    name: 'BMW M3',
    brand: { name: 'BMW' },
    model: { name: '3 Series' },
    generation: { 
      name: 'E46',
      startYear: 2000,
      endYear: 2006
    },
    engine: {
      power: 343,
      displacement: 3246
    },
    performance: {
      topSpeed: 250
    },
    photos: [{ url: 'https://example.com/photo.jpg' }],
    imageUrl: 'https://example.com/image.jpg',
    productionYears: '2000 - 2006',
  };

  const mockToggleComparison = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render car card', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.getByText('BMW M3')).toBeInTheDocument();
    });

    it('should render car image', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', mockCar.imageUrl);
      expect(img).toHaveAttribute('alt', 'BMW M3');
    });

    it('should render placeholder when no image', () => {
      const carWithoutImage = { ...mockCar, imageUrl: null, photos: [] };
      renderWithRouter(<CarCard car={carWithoutImage} />);
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render year range', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.getByText('2000 - 2006')).toBeInTheDocument();
    });

    it('should generate name from brand/model/generation when name is missing', () => {
      const carWithoutName = { ...mockCar, name: null };
      renderWithRouter(<CarCard car={carWithoutName} />);
      
      expect(screen.getByText('BMW 3 Series E46')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = renderWithRouter(
        <CarCard car={mockCar} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('car details', () => {
    it('should render engine power', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.getByText('343 HP')).toBeInTheDocument();
    });

    it('should render engine displacement', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.getByText('3.2L')).toBeInTheDocument();
    });

    it('should render top speed', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.getByText('250 km/h')).toBeInTheDocument();
    });

    it('should not render missing specs', () => {
      const carWithoutSpecs = { ...mockCar, engine: null, performance: null };
      renderWithRouter(<CarCard car={carWithoutSpecs} />);
      
      expect(screen.queryByText('HP')).not.toBeInTheDocument();
      expect(screen.queryByText('km/h')).not.toBeInTheDocument();
    });
  });

  describe('links', () => {
    it('should link to car details page', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      const links = screen.getAllByRole('link');
      expect(links.some(link => link.getAttribute('href') === '/cars/1')).toBe(true);
    });
  });

  describe('comparison', () => {
    it('should show add to comparison button when not in comparison', () => {
      renderWithRouter(
        <CarCard 
          car={mockCar} 
          isInComparison={false}
          onToggleComparison={mockToggleComparison}
        />
      );
      
      expect(screen.getByText('card.compare')).toBeInTheDocument();
    });

    it('should show added text when in comparison', () => {
      renderWithRouter(
        <CarCard 
          car={mockCar} 
          isInComparison={true}
          onToggleComparison={mockToggleComparison}
        />
      );
      
      expect(screen.getByText('card.added')).toBeInTheDocument();
    });

    it('should call onToggleComparison when button clicked', () => {
      renderWithRouter(
        <CarCard 
          car={mockCar} 
          isInComparison={false}
          onToggleComparison={mockToggleComparison}
        />
      );
      
      fireEvent.click(screen.getByText('card.compare'));
      
      expect(mockToggleComparison).toHaveBeenCalledWith(mockCar);
    });

    it('should not render comparison button when onToggleComparison is not provided', () => {
      renderWithRouter(<CarCard car={mockCar} />);
      
      expect(screen.queryByText('card.compare')).not.toBeInTheDocument();
      expect(screen.queryByText('card.added')).not.toBeInTheDocument();
    });
  });
});
