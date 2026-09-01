import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataProposalModal from '../DataProposalModal';


// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
  })),
}));

// Mock dataProposals API
vi.mock('../api', () => ({
  createProposal: vi.fn(() => Promise.resolve({ id: 1 })),
}));

// Mock tags API
vi.mock('../../../shared/api/tags', () => ({
  getTags: vi.fn(() => Promise.resolve([])),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoCheckmarkCircle: () => <span data-testid="icon-checkmark" />,
  IoDocumentTextOutline: () => <span data-testid="icon-document" />,
  IoCloseOutline: () => <span data-testid="icon-close" />,
  IoChevronDownOutline: () => <span data-testid="icon-chevron" />,
}));

// Mock constants
vi.mock('../categories', async (importOriginal) => ({
  ...(await importOriginal()),
  PROPOSAL_CATEGORIES: [
    { value: 'ENGINE', labelKey: 'engine' },
    { value: 'TRANSMISSION', labelKey: 'transmission' },
    { value: 'CHASSIS', labelKey: 'chassis' },
    { value: 'PERFORMANCE', labelKey: 'performance' },
  ],
}));


describe('DataProposalModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    carId: 1,
    carName: 'BMW M3',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<DataProposalModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render category select', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByLabelText('dataProposal.category')).toBeInTheDocument();
    });

    it('should render comment textarea', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByLabelText('dataProposal.comment')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByText('dataProposal.submit')).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByText('common:buttons.cancel')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: 'a11y.closeModal' });
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const cancelButton = screen.getByText('common:buttons.cancel');
      await user.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should allow selecting a category', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('dataProposal.category');
      await user.selectOptions(categorySelect, 'ENGINE');

      expect(categorySelect.value).toBe('ENGINE');
    });

    it('should show category fields when category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('dataProposal.category');
      await user.selectOptions(categorySelect, 'ENGINE');

      await waitFor(() => {
        expect(screen.getByText('dataProposal.fields.engineCode')).toBeInTheDocument();
      });
    });

    it('should allow entering comment', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const commentTextarea = screen.getByLabelText('dataProposal.comment');
      await user.type(commentTextarea, 'This is a test comment');

      expect(commentTextarea.value).toBe('This is a test comment');
    });
  });

  describe('form validation', () => {
    it('should require category selection for submission', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const submitButton = screen.getByText('dataProposal.submit');
      await user.click(submitButton);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('category fields', () => {
    it('should show transmission fields when TRANSMISSION category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('dataProposal.category');
      await user.selectOptions(categorySelect, 'TRANSMISSION');

      await waitFor(() => {
        expect(screen.getByText('dataProposal.fields.transmissionType')).toBeInTheDocument();
      });
    });

    it('should show chassis fields when CHASSIS category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('dataProposal.category');
      await user.selectOptions(categorySelect, 'CHASSIS');

      await waitFor(() => {
        expect(screen.getByText('dataProposal.fields.driveType')).toBeInTheDocument();
      });
    });

    it('should show performance fields when PERFORMANCE category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('dataProposal.category');
      await user.selectOptions(categorySelect, 'PERFORMANCE');

      await waitFor(() => {
        expect(screen.getByText('dataProposal.fields.maxSpeed')).toBeInTheDocument();
      });
    });
  });
});
