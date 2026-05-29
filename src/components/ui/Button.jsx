import { forwardRef } from 'react';
import { Link } from 'react-router-dom';


// Reusable button component with multiple variants and states
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  to,
  href,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}, ref) => {
  
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary-600 hover:bg-primary-700 
      text-white 
      focus:ring-primary-500
    `,
    secondary: `
      bg-neutral-100 dark:bg-neutral-800
      hover:bg-neutral-200 dark:hover:bg-neutral-700
      text-neutral-700 dark:text-neutral-200
      focus:ring-neutral-500
    `,
    outline: `
      border border-neutral-300 dark:border-neutral-600
      hover:bg-neutral-100 dark:hover:bg-neutral-800
      text-neutral-700 dark:text-neutral-200
      focus:ring-neutral-500
    `,
    ghost: `
      hover:bg-neutral-100 dark:hover:bg-neutral-800
      text-neutral-600 dark:text-neutral-300
      focus:ring-neutral-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white
      focus:ring-red-500
    `,
    white: `
      bg-white hover:bg-neutral-50
      text-primary-600
      focus:ring-white
      shadow-lg
    `,
    'ghost-light': `
      bg-white/10 hover:bg-white/20
      text-white
      border border-white/20
      focus:ring-white
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={combinedClassName} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={combinedClassName} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
