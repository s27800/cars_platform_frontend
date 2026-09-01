
// Reusable Card component with multiple variants and subcomponents
const Card = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white dark:bg-neutral-800',
    elevated: 'bg-white dark:bg-neutral-800 shadow-lg',
    bordered: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardStyles = `
    rounded-2xl
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
};


// Subcomponents

Card.Header = ({ className = '', children, ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ as: Tag = 'h3', className = '', children, ...props }) => (
  <Tag className={`text-lg font-semibold text-neutral-900 dark:text-white ${className}`} {...props}>
    {children}
  </Tag>
);

Card.Description = ({ className = '', children, ...props }) => (
  <p className={`text-sm text-neutral-600 dark:text-neutral-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

Card.Content = ({ className = '', children, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ className = '', children, ...props }) => (
  <div className={`mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
