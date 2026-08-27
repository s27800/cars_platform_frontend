import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LanguageSwitcher from '../LanguageSwitcher';


// Mock useLanguage hook
const mockChangeLanguage = vi.fn();

const mockUseLanguage = vi.fn(() => ({
  language: 'en',
  changeLanguage: mockChangeLanguage,
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'pl', name: 'Polski' },
  ],
  isSyncing: false,
}));

vi.mock('../../../hooks', () => ({
  useLanguage: () => mockUseLanguage(),
}));


describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLanguage.mockReturnValue({
      language: 'en',
      changeLanguage: mockChangeLanguage,
      availableLanguages: [
        { code: 'en', name: 'English' },
        { code: 'pl', name: 'Polski' },
      ],
      isSyncing: false,
    });
  });

  describe('rendering', () => {
    it('should render language switcher button', () => {
      render(<LanguageSwitcher />);
      
      expect(screen.getByRole('button', { name: 'Change language' })).toBeInTheDocument();
    });

    it('should render flag icon', () => {
      const { container } = render(<LanguageSwitcher />);
      
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should show label by default', () => {
      render(<LanguageSwitcher />);
      
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should hide label when showLabel is false', () => {
      render(<LanguageSwitcher showLabel={false} />);
      
      expect(screen.queryByText('English')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Change language' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<LanguageSwitcher className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('dropdown behavior', () => {
    it('should not show dropdown initially', () => {
      render(<LanguageSwitcher />);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should show dropdown when button is clicked', () => {
      render(<LanguageSwitcher />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should have aria-expanded attribute', () => {
      render(<LanguageSwitcher />);
      
      const button = screen.getByRole('button', { name: 'Change language' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-haspopup attribute', () => {
      render(<LanguageSwitcher />);
      
      expect(screen.getByRole('button', { name: 'Change language' })).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should close dropdown when clicking outside', () => {
      render(
        <div>
          <LanguageSwitcher />
          <div data-testid="outside">Outside</div>
        </div>
      );
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      fireEvent.mouseDown(screen.getByTestId('outside'));
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('language options', () => {
    it('should show available language options', () => {
      render(<LanguageSwitcher />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      
      expect(screen.getByRole('option', { name: /English/ })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Polski/ })).toBeInTheDocument();
    });

    it('should call changeLanguage when option is clicked', () => {
      render(<LanguageSwitcher />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      fireEvent.click(screen.getByRole('option', { name: /Polski/ }));
      
      expect(mockChangeLanguage).toHaveBeenCalledWith('pl');
    });

    it('should close dropdown when language is selected', () => {
      render(<LanguageSwitcher />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      fireEvent.click(screen.getByRole('option', { name: /Polski/ }));
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should indicate current language with aria-selected', () => {
      render(<LanguageSwitcher />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Change language' }));
      
      const englishOption = screen.getByRole('option', { name: /English/ });
      expect(englishOption).toHaveAttribute('aria-selected', 'true');
      
      const polishOption = screen.getByRole('option', { name: /Polski/ });
      expect(polishOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('disabled state', () => {
    it('should be disabled when syncing', () => {
      mockUseLanguage.mockReturnValue({
        language: 'en',
        changeLanguage: mockChangeLanguage,
        availableLanguages: [
          { code: 'en', name: 'English' },
          { code: 'pl', name: 'Polski' },
        ],
        isSyncing: true,
      });

      render(<LanguageSwitcher />);
      
      expect(screen.getByRole('button', { name: 'Change language' })).toBeDisabled();
    });
  });
});
