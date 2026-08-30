import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataProposalModal from '../DataProposalModal';


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
vi.mock('../../../api/dataProposals', () => ({
  createProposal: vi.fn(() => Promise.resolve({ id: 1 })),
}));

// Mock tags API
vi.mock('../../../api/tags', () => ({
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
vi.mock('../../../utils/constants', () => ({
  PROPOSAL_CATEGORIES: [
    { value: 'ENGINE', label: 'Engine' },
    { value: 'TRANSMISSION', label: 'Transmission' },
    { value: 'CHASSIS', label: 'Chassis' },
    { value: 'PERFORMANCE', label: 'Performance' },
  ],
}));

// Mock UI components
vi.mock('../../components/ui', () => {
  const ModalComponent = ({ isOpen, onClose, children, title }) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="close-modal">Close</button>
        {children}
      </div>
    ) : null;
  ModalComponent.Footer = ({ children }) => <div data-testid="modal-footer">{children}</div>;

  return {
    Modal: ModalComponent,
    Button: ({ children, onClick, type, disabled, isLoading }) => (
      <button onClick={onClick} type={type} disabled={disabled || isLoading}>
        {isLoading ? 'Loading...' : children}
      </button>
    ),
    Select: ({ label, options, value, onChange, error }) => (
      <div>
        <label>{label}</label>
        <select value={value} onChange={onChange} data-testid={`select-${label}`}>
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    ),
    TextArea: ({ label, value, onChange, error, ...props }) => (
      <div>
        <label>{label}</label>
        <textarea value={value} onChange={onChange} data-testid={`textarea-${label}`} {...props} />
        {error && <span>{error}</span>}
      </div>
    ),
    Input: ({ label, value, onChange, type, ...props }) => (
      <div>
        <label>{label}</label>
        <input type={type} value={value} onChange={onChange} data-testid={`input-${label}`} {...props} />
      </div>
    ),
    Alert: ({ children, variant }) => <div data-testid={`alert-${variant}`}>{children}</div>,
    Checkbox: ({ label, checked, onChange }) => (
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </label>
    ),
  };
});


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

  describe('module', () => {
    it('should export DataProposalModal component', () => {
      expect(DataProposalModal).toBeDefined();
      expect(typeof DataProposalModal).toBe('function');
    });
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
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
    });

    it('should render comment textarea', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByLabelText(/additional notes/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByText('Submit Proposal')).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(<DataProposalModal {...defaultProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should allow selecting a category', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'ENGINE');

      expect(categorySelect.value).toBe('ENGINE');
    });

    it('should show category fields when category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'ENGINE');

      await waitFor(() => {
        expect(screen.getByText('Engine Code')).toBeInTheDocument();
      });
    });

    it('should allow entering comment', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const commentTextarea = screen.getByLabelText(/additional notes/i);
      await user.type(commentTextarea, 'This is a test comment');

      expect(commentTextarea.value).toBe('This is a test comment');
    });
  });

  describe('form validation', () => {
    it('should require category selection for submission', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const submitButton = screen.getByText('Submit Proposal');
      await user.click(submitButton);

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('category fields', () => {
    it('should show transmission fields when TRANSMISSION category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'TRANSMISSION');

      await waitFor(() => {
        expect(screen.getByText('Type')).toBeInTheDocument();
      });
    });

    it('should show chassis fields when CHASSIS category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'CHASSIS');

      await waitFor(() => {
        expect(screen.getByText('Drive Type')).toBeInTheDocument();
      });
    });

    it('should show performance fields when PERFORMANCE category is selected', async () => {
      const user = userEvent.setup();
      render(<DataProposalModal {...defaultProps} />);

      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'PERFORMANCE');

      await waitFor(() => {
        expect(screen.getByText('Max Speed (km/h)')).toBeInTheDocument();
      });
    });
  });
});
