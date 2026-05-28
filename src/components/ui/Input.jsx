import { forwardRef } from 'react';


// Reusable Input component with label, error states, and icon support
const Input = forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || props.name;

  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  const inputStyles = `
    w-full rounded-xl
    bg-neutral-100 dark:bg-neutral-800
    border border-transparent
    focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-900
    text-neutral-900 dark:text-white
    placeholder-neutral-500 dark:placeholder-neutral-400
    transition-all outline-none
    ${leftIcon ? 'pl-10' : 'pl-4'}
    ${rightIcon ? 'pr-10' : 'pr-4'}
    ${sizes[size]}
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputStyles}
          {...props}
        />
        
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
