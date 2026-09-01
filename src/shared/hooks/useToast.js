import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';


// Reads the toast context and fails loudly outside its provider
const useToast = () => {
  const context = useContext(ToastContext);

  if (!context)
    throw new Error('useToast must be used within a ToastProvider');

  return context;
};

export default useToast;
