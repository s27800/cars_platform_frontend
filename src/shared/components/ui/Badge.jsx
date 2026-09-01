
// Small status label with color variants
const Badge = ({
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const badgeStyles = `
    inline-flex items-center font-medium
    ${variants[variant]}
    ${sizes[size]}
    ${rounded ? 'rounded-full' : 'rounded-md'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeStyles} {...props}>
      {children}
    </span>
  );
};

export default Badge;
