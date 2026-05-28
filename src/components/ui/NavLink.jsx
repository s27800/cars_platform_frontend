import { Link } from 'react-router-dom';


// Reusable navigation link component with active state styling
const NavLink = ({
  to,
  isActive = false,
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: {
      base: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
      active: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
      inactive: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
    mobile: {
      base: 'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
      active: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
      inactive: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
  };

  const currentVariant = variants[variant];
  
  const linkStyles = `
    ${currentVariant.base}
    ${isActive ? currentVariant.active : currentVariant.inactive}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Link to={to} className={linkStyles} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;
