import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteAccountSection from '../DeleteAccountSection';


const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

vi.mock('../../../shared/hooks', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

vi.mock('../api', () => ({
  deleteAccount: vi.fn(),
}));

vi.mock('react-icons/io5', () => ({
  IoTrashOutline: () => <span data-testid="icon" />,
  IoWarningOutline: () => <span data-testid="icon" />,
}));

vi.mock('../../../shared/components/ui', () => ({
  Button: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
  Alert: ({ children, variant }) => <div role="alert" data-variant={variant}>{children}</div>,
  ConfirmModal: ({ isOpen, onClose, onConfirm, isLoading }) => (
    isOpen ? (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm} disabled={isLoading}>confirm-delete</button>
        <button onClick={onClose}>cancel-delete</button>
      </div>
    ) : null
  ),
}));

let mutationState;
const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options) => {
    mutationState.options = options;

    return {
      mutate: (...args) => {
        mockMutate(...args);
        mutationState.onMutate?.(options);
      },
      isPending: mutationState.isPending,
    };
  },
}));


describe('DeleteAccountSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutationState = { isPending: false, options: null, onMutate: null };
  });

  const openConfirmation = () => {
    fireEvent.click(screen.getByRole('button', { name: 'deleteAccount.confirm' }));
  };


  describe('rendering', () => {
    it('should show the danger zone heading', () => {
      render(<DeleteAccountSection />);

      expect(screen.getByText('common:dangerZone')).toBeInTheDocument();
    });

    it('should describe what deleting the account does', () => {
      render(<DeleteAccountSection />);

      expect(screen.getByText('deleteAccount.title')).toBeInTheDocument();
      expect(screen.getByText('deleteAccount.description')).toBeInTheDocument();
    });

    it('should keep the confirmation closed until asked', () => {
      render(<DeleteAccountSection />);

      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });

    it('should not show an error before anything went wrong', () => {
      render(<DeleteAccountSection />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });


  describe('confirmation', () => {
    it('should ask for confirmation before deleting', () => {
      render(<DeleteAccountSection />);

      openConfirmation();

      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should not delete anything when the confirmation is dismissed', () => {
      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'cancel-delete' }));

      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should delete the account once confirmed', () => {
      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it('should disable the confirm button while the request is in flight', () => {
      mutationState.isPending = true;
      render(<DeleteAccountSection />);

      openConfirmation();

      expect(screen.getByRole('button', { name: 'confirm-delete' })).toBeDisabled();
    });
  });


  describe('after a successful deletion', () => {
    beforeEach(() => {
      mutationState.onMutate = (options) => options.onSuccess();
    });

    it('should log the user out', async () => {
      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      await waitFor(() => expect(mockLogout).toHaveBeenCalled());
    });

    it('should send the user home without leaving the profile in the history', async () => {
      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }));
    });
  });


  describe('after a failed deletion', () => {
    it('should show the message the server sent', async () => {
      mutationState.onMutate = (options) => options.onError({
        response: { data: { message: 'Account has pending reports' } },
      });

      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      expect(await screen.findByRole('alert')).toHaveTextContent('Account has pending reports');
    });

    it('should fall back to a generic message when the server sent none', async () => {
      mutationState.onMutate = (options) => options.onError(new Error('network down'));

      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      expect(await screen.findByRole('alert')).toHaveTextContent('deleteAccount.error');
    });

    it('should close the confirmation so the user is not stuck on it', async () => {
      mutationState.onMutate = (options) => options.onError(new Error('network down'));

      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      await waitFor(() => expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument());
    });

    it('should keep the user logged in', async () => {
      mutationState.onMutate = (options) => options.onError(new Error('network down'));

      render(<DeleteAccountSection />);

      openConfirmation();
      fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }));

      await screen.findByRole('alert');

      expect(mockLogout).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
