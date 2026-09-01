// Indeterminate loading indicator
const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        border-neutral-300 dark:border-neutral-600
        border-t-primary-600 dark:border-t-primary-500
        animate-spin
        ${className}
      `}
    />
  );
};

export default Spinner;
