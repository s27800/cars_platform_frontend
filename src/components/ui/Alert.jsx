import { 
  IoCheckmarkCircleOutline, 
  IoAlertCircleOutline, 
  IoWarningOutline, 
  IoInformationCircleOutline,
  IoCloseOutline,
} from 'react-icons/io5';


// Reusable alert component for displaying contextual feedback messages.
const Alert = ({
  variant = 'info',
  title,
  onClose,
  className = '',
  children,
}) => {

  // Variant styles and icons
  const variants = {
    success: {
      wrapper: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: <IoCheckmarkCircleOutline className="w-5 h-5 text-green-600 dark:text-green-400" />,
      title: 'text-green-800 dark:text-green-200',
      text: 'text-green-700 dark:text-green-300',
    },
    error: {
      wrapper: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: <IoAlertCircleOutline className="w-5 h-5 text-red-600 dark:text-red-400" />,
      title: 'text-red-800 dark:text-red-200',
      text: 'text-red-700 dark:text-red-300',
    },
    warning: {
      wrapper: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: <IoWarningOutline className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      title: 'text-yellow-800 dark:text-yellow-200',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
    info: {
      wrapper: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: <IoInformationCircleOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'text-blue-800 dark:text-blue-200',
      text: 'text-blue-700 dark:text-blue-300',
    },
  };

  const styles = variants[variant];

  return (
    <div 
      className={`
        flex gap-3 p-4 rounded-xl border
        ${styles.wrapper}
        ${className}
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-medium ${styles.title}`}>
            {title}
          </h4>
        )}
        
        {children && (
          <div className={`${title ? 'mt-1' : ''} text-sm ${styles.text}`}>
            {children}
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-lg transition-colors
            hover:bg-black/5 dark:hover:bg-white/5
            ${styles.text}
          `}
          aria-label="Dismiss alert"
        >
          <IoCloseOutline className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
