import { forwardRef } from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';


// Native select styled to match the Input component
const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select...',
  size = 'md',
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || props.name;

  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  };

  const selectStyles = `
    w-full rounded-xl appearance-none
    bg-neutral-100 dark:bg-neutral-700
    border border-neutral-200 dark:border-neutral-600
    focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-800
    text-neutral-900 dark:text-white
    transition-all outline-none
    pl-4 pr-10
    ${sizes[size]}
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectStyles}
          {...props}
        >
          {placeholder && !options.some(opt => opt.value === '') && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          <IoChevronDownOutline className="w-4 h-4" />
        </span>
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

Select.displayName = 'Select';

export default Select;
