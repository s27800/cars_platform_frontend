
// Reusable IconButton component for icon-only actions
const IconButton = ({
  variant = 'default',
  size = 'md',
  label,
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: `
      text-neutral-600 dark:text-neutral-300
      hover:bg-neutral-100 dark:hover:bg-neutral-800
    `,
    primary: `
      text-primary-600 dark:text-primary-400
      hover:bg-primary-50 dark:hover:bg-primary-900/20
    `,
    danger: `
      text-red-600 dark:text-red-400
      hover:bg-red-50 dark:hover:bg-red-900/20
    `,
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const buttonStyles = `
    inline-flex items-center justify-center
    rounded-lg transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={buttonStyles}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
