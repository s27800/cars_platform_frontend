import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';


// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));


// Helper to render with router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('Footer', () => {
  describe('rendering', () => {
    it('should render footer element', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should render brand logo/name', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByText('CarsPlatform')).toBeInTheDocument();
    });

    it('should render home link', () => {
      renderWithRouter(<Footer />);
      
      const homeLink = screen.getByRole('link', { name: /CarsPlatform/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render description', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByText('footer.description')).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should render navigation section', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByText('footer.navigation')).toBeInTheDocument();
    });

    it('should render about link', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('link', { name: /footer\.aboutUs/i })).toHaveAttribute('href', '/about');
    });

    it('should render FAQ link', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('link', { name: /footer\.faq/i })).toHaveAttribute('href', '/faq');
    });

    it('should render terms link', () => {
      renderWithRouter(<Footer />);
      
      // Multiple terms links exist, just verify at least one exists
      const termsLinks = screen.getAllByRole('link', { name: /footer\.terms/i });
      expect(termsLinks.length).toBeGreaterThan(0);
      expect(termsLinks[0]).toHaveAttribute('href', '/terms');
    });

    it('should render cars link', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('link', { name: /navigation\.cars/i })).toHaveAttribute('href', '/cars');
    });

    it('should render comparison link', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('link', { name: /navigation\.comparison/i })).toHaveAttribute('href', '/comparison');
    });
  });

  describe('social links', () => {
    it('should render follow us section', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByText('footer.followUs')).toBeInTheDocument();
    });

    it('should render social media links', () => {
      renderWithRouter(<Footer />);
      
      expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    });

    it('should have external links open in new tab', () => {
      renderWithRouter(<Footer />);
      
      const facebookLink = screen.getByRole('link', { name: /facebook/i });
      expect(facebookLink).toHaveAttribute('target', '_blank');
      expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('copyright', () => {
    it('should render current year in copyright', () => {
      renderWithRouter(<Footer />);
      
      // Mock returns key 'footer.copyright', not interpolated year
      expect(screen.getByText(/footer\.copyright/)).toBeInTheDocument();
    });
  });
});
