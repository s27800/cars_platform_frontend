import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline, 
  IoWarningOutline, 
  IoInformationCircleOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { ToastContext } from '../../contexts/ToastContext';


const ToastItem = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Variant styles
  const variants = {
    success: {
      wrapper: 'bg-green-50 dark:bg-green-900/90 border-green-300 dark:border-green-700',
      icon: <IoCheckmarkCircleOutline className="w-5 h-5 text-green-600 dark:text-green-400" />,
      text: 'text-green-800 dark:text-green-100',
    },
    error: {
      wrapper: 'bg-red-50 dark:bg-red-900/90 border-red-300 dark:border-red-700',
      icon: <IoAlertCircleOutline className="w-5 h-5 text-red-600 dark:text-red-400" />,
      text: 'text-red-800 dark:text-red-100',
    },
    warning: {
      wrapper: 'bg-yellow-50 dark:bg-yellow-900/90 border-yellow-300 dark:border-yellow-700',
      icon: <IoWarningOutline className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      text: 'text-yellow-800 dark:text-yellow-100',
    },
    info: {
      wrapper: 'bg-blue-50 dark:bg-blue-900/90 border-blue-300 dark:border-blue-700',
      icon: <IoInformationCircleOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      text: 'text-blue-800 dark:text-blue-100',
    },
  };

  const styles = variants[toast.variant] || variants.info;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm
        transform transition-all duration-200 ease-out
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
        ${styles.wrapper}
      `}
    >
      <div className="flex-shrink-0">
        {styles.icon}
      </div>
      
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>
        {toast.message}
      </p>

      <button
        type="button"
        onClick={handleClose}
        className={`
          flex-shrink-0 p-1 rounded-lg transition-colors
          hover:bg-black/10 dark:hover:bg-white/10
          ${styles.text}
        `}
        aria-label="Dismiss notification"
      >
        <IoCloseOutline className="w-4 h-4" />
      </button>
    </div>
  );
};


const ToastContainer = () => {
  const context = useContext(ToastContext);
  
  if (!context)
    return null;

  const { toasts, removeToast } = context;

  if (toasts.length === 0)
    return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  );
};


let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

export const showToast = {
  success: (message) => toastRef?.success(message),
  error: (message) => toastRef?.error(message),
  warning: (message) => toastRef?.warning(message),
  info: (message) => toastRef?.info(message),
};

export { ToastContainer };
export default ToastContainer;
