import { IoWarningOutline, IoAlertCircleOutline } from 'react-icons/io5';
import Modal from './Modal';
import Button from './Button';


/**
 * Reusable confirmation modal for dangerous actions.
 * Shows a warning icon and requires confirmation.
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const isDanger = variant === 'danger';

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="text-center">

        {/* Warning Icon */}
        <div className={`
          mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4
          ${isDanger
            ? 'bg-red-100 dark:bg-red-900/30'
            : 'bg-yellow-100 dark:bg-yellow-900/30'
          }
        `}>
          {isDanger ? (
            <IoAlertCircleOutline className="w-8 h-8 text-red-600 dark:text-red-400" />
          ) : (
            <IoWarningOutline className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          )}
        </div>

        {/* Message */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          {message}
        </p>

        {/* Danger notice */}
        {isDanger && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-6">
            This action cannot be undone.
          </p>
        )}
      </div>

      <Modal.Footer className="justify-center">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={isDanger ? 'danger' : 'primary'}
          onClick={handleConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
