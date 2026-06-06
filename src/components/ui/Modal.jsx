import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { IconButton } from './';


// Reusable modal component with accessibility features and multiple size options.
const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  children,
}) => {
  const modalRef = useRef(null);
  const previousIsOpen = useRef(false);

  const handleEscape = useCallback((event) => {
    if (closeOnEscape && event.key === 'Escape')
      onClose();

  }, [closeOnEscape, onClose]);

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget)
      onClose();
  };

  // Setup event listeners and body scroll lock
  useEffect(() => {
    if (!isOpen) {
      previousIsOpen.current = false;
      return;
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    if (!previousIsOpen.current && modalRef.current) {
      modalRef.current.focus();
      previousIsOpen.current = true;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen)
    return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          w-full ${sizes[size]} bg-white dark:bg-neutral-800 
          rounded-2xl shadow-2xl transform transition-all
          max-h-[90vh] flex flex-col
          ${className}
        `}
      >

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            {title && (
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
                className="ml-auto"
              >
                <IoCloseOutline className="w-5 h-5" />
              </IconButton>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};


// Subcomponent for modal footer with actions
Modal.Footer = ({ className = '', children }) => (
  <div className={`
    flex items-center justify-end gap-3 px-6 py-4 
    border-t border-neutral-200 dark:border-neutral-700
    ${className}
  `}>
    {children}
  </div>
);

export default Modal;
