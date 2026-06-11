import { createContext, useState, useCallback, useMemo } from 'react';


export const ToastContext = createContext(null);

const TOAST_DURATIONS = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

let toastIdCounter = 0;


export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ message, variant = 'info', duration }) => {
    const id = ++toastIdCounter;
    const toast = {
      id,
      message,
      variant,
      duration: duration ?? TOAST_DURATIONS[variant] ?? 3000,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [removeToast]);

  // Convenience methods
  const success = useCallback((message, duration) => {
    return addToast({ message, variant: 'success', duration });
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast({ message, variant: 'error', duration });
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast({ message, variant: 'warning', duration });
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast({ message, variant: 'info', duration });
  }, [addToast]);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  }), [toasts, addToast, removeToast, success, error, warning, info, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};


export default ToastContext;
