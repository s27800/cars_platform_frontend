import { forwardRef } from 'react';
import { IoCheckmarkOutline } from 'react-icons/io5';


const Checkbox = forwardRef(({
  label,
  error,
  checked = false,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || props.name || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={className}>
      <label htmlFor={checkboxId} className="flex items-center gap-3 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
            ${checked 
              ? 'bg-primary-600 border-primary-600' 
              : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
            }
            peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2 dark:peer-focus:ring-offset-neutral-900
          `}>
            {checked && (
              <IoCheckmarkOutline className="w-3.5 h-3.5 text-white" />
            )}
          </div>
        </div>
        
        {label && (
          <span className="text-sm text-neutral-700 dark:text-neutral-300 select-none">
            {label}
          </span>
        )}
      </label>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
