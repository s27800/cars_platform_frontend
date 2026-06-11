

// Base skeleton component for loading placeholders
const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animation = 'pulse',
}) => {

  // Base styles for all variants
  const baseStyles = `
    bg-neutral-200 dark:bg-neutral-700
    ${animation === 'pulse' ? 'animate-pulse' : ''}
    ${animation === 'shimmer' ? 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 bg-[length:200%_100%]' : ''}
  `;

  // Variant-specific styles
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
  };

  const style = {};
  
  if (width)
    style.width = typeof width === 'number' ? `${width}px` : width;

  if (height)
    style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  );
};


// Preset skeleton for text lines
Skeleton.Text = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
      />
    ))}
  </div>
);


// Preset skeleton for avatars
Skeleton.Avatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizes[size]} ${className}`}
    />
  );
};


// Preset skeleton for buttons
Skeleton.Button = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <Skeleton
      variant="rounded"
      className={`${sizes[size]} ${className}`}
    />
  );
};


// Preset skeleton for images
Skeleton.Image = ({ aspectRatio = '16/9', className = '' }) => (
  <div className={`relative ${className}`} style={{ aspectRatio }}>
    <Skeleton variant="rounded" className="absolute inset-0 w-full h-full" />
  </div>
);


export default Skeleton;
