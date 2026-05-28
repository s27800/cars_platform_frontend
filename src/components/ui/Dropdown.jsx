
// Reusable Dropdown component with multiple variants and subcomponents
const Dropdown = ({
  isOpen,
  align = 'right',
  className = '',
  children,
  ...props
}) => {
  if (!isOpen) 
    return null;

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
  };

  const dropdownStyles = `
    absolute mt-2 py-2
    bg-white dark:bg-neutral-800
    rounded-xl shadow-lg
    border border-neutral-200 dark:border-neutral-700
    z-50 min-w-[200px]
    ${alignStyles[align]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={dropdownStyles} {...props}>
      {children}
    </div>
  );
};


// Subcomponents

Dropdown.Item = ({
  as: Component = 'button',
  variant = 'default',
  icon,
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700',
    danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
    primary: 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  };

  const itemStyles = `
    w-full flex items-center gap-3 px-4 py-2
    text-sm transition-colors text-left
    ${variants[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component className={itemStyles} {...props}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </Component>
  );
};

Dropdown.Divider = ({ className = '' }) => (
  <div className={`my-1 border-t border-neutral-200 dark:border-neutral-700 ${className}`} />
);

Dropdown.Header = ({ className = '', children, ...props }) => (
  <div className={`px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 ${className}`} {...props}>
    {children}
  </div>
);


export default Dropdown;
