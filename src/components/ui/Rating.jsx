import { useState } from 'react';
import { IoStar, IoStarOutline, IoStarHalf } from 'react-icons/io5';


// Reusable flexible rating component
const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  showValue = false,
  precision = 0.5,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const gapSizes = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1',
    xl: 'gap-1.5',
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleMouseMove = (event, starIndex) => {
    if (readonly)
      return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    let newValue;

    if (precision === 0.5)
      newValue = percent <= 0.5 ? starIndex + 0.5 : starIndex + 1;
    else
      newValue = starIndex + 1;

    setHoverValue(Math.min(newValue, max));
  };

  const handleMouseLeave = () => {
    if (!readonly)
      setHoverValue(null);
  };

  const handleClick = (event, starIndex) => {
    if (readonly || !onChange)
      return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    let newValue;

    if (precision === 0.5)
      newValue = percent <= 0.5 ? starIndex + 0.5 : starIndex + 1;
    else
      newValue = starIndex + 1;

    onChange(Math.min(newValue, max));
  };

  const renderStar = (starIndex) => {
    const fillLevel = displayValue - starIndex;

    const StarIcon = fillLevel >= 1 
      ? IoStar 
      : fillLevel >= 0.5 
        ? IoStarHalf 
        : IoStarOutline;

    const starColor = fillLevel > 0 
      ? 'text-yellow-400' 
      : 'text-neutral-300 dark:text-neutral-600';

    return (
      <span
        key={starIndex}
        className={`
          ${starColor} ${sizes[size]}
          ${!readonly ? 'cursor-pointer transition-transform hover:scale-110' : ''}
        `}
        onMouseMove={(e) => handleMouseMove(e, starIndex)}
        onClick={(e) => handleClick(e, starIndex)}
      >
        <StarIcon className="w-full h-full" />
      </span>
    );
  };

  return (
    <div 
      className={`inline-flex items-center ${gapSizes[size]} ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: max }, (_, i) => renderStar(i))}
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};


// Input wrapper for the Rating component
Rating.Input = ({
  value = 0,
  onChange,
  max = 5,
  size = 'lg',
  label,
  error,
  required,
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Rating
        value={value}
        onChange={onChange}
        max={max}
        size={size}
        precision={1}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Rating;
