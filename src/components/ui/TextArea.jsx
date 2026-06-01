import { forwardRef } from 'react';


// Reusable TextArea component
const TextArea = forwardRef(({
  label,
  error,
  hint,
  maxLength,
  showCount = false,
  rows = 4,
  resize = 'vertical',
  fullWidth = true,
  className = '',
  id,
  value,
  ...props
}, ref) => {
  const inputId = id || props.name;
  const currentLength = value?.length || 0;

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const textareaStyles = `
    w-full rounded-xl px-4 py-3
    bg-neutral-100 dark:bg-neutral-700
    border border-neutral-200 dark:border-neutral-600
    focus:border-primary-500 focus:bg-white dark:focus:bg-neutral-800
    text-neutral-900 dark:text-white
    placeholder-neutral-500 dark:placeholder-neutral-400
    transition-all outline-none
    ${resizeClasses[resize]}
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
      
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={textareaStyles}
        {...props}
      />

      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          {hint && !error && (
            <p className="text-sm text-neutral-500">{hint}</p>
          )}
        </div>

        {showCount && maxLength && (
          <span className={`text-xs ${
            currentLength >= maxLength 
              ? 'text-red-500' 
              : 'text-neutral-400'
          }`}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
