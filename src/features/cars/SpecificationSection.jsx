import { useState } from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';


// Reusable collapsible section component for displaying car specifications
const SpecificationSection = ({
  title,
  icon,
  defaultOpen = false,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-primary-600 dark:text-primary-400">
              {icon}
            </span>
          )}
          <span className="font-medium text-neutral-900 dark:text-white">
            {title}
          </span>
        </div>

        <IoChevronDownOutline
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-4 bg-white dark:bg-neutral-800">
          {children}
        </div>
      )}
    </div>
  );
};


// Single specification row
SpecificationSection.Item = ({ label, value, unit = '', className = '' }) => {
  if (value === null || value === undefined || value === '')
    return null;

  return (
    <div className={`flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0 ${className}`}>
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-900 dark:text-white">
        {value}{unit && ` ${unit}`}
      </span>
    </div>
  );
};

// Grid layout for specification items
SpecificationSection.Grid = ({ columns = 2, className = '', children }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-x-8 ${className}`}>
      {children}
    </div>
  );
};

export default SpecificationSection;
