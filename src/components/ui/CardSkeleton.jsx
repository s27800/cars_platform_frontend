import Skeleton from './Skeleton';


// Skeleton placeholder for car cards matching the design of CarCard component
const CardSkeleton = ({ className = '' }) => {
  return (
    <div
      className={`
        bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden
        border border-neutral-200 dark:border-neutral-800
        ${className}
      `}
    >

      {/* Image skeleton */}
      <Skeleton.Image aspectRatio="4/3" />

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Title */}
        <Skeleton variant="text" className="h-5 w-3/4" />
        
        {/* Subtitle */}
        <Skeleton variant="text" className="h-4 w-1/2" />

        {/* Specs row */}
        <div className="flex gap-4 pt-2">
          <Skeleton variant="rounded" className="h-6 w-16" />
          <Skeleton variant="rounded" className="h-6 w-16" />
          <Skeleton variant="rounded" className="h-6 w-16" />
        </div>

        {/* Button row */}
        <div className="flex gap-2 pt-2">
          <Skeleton.Button size="md" className="flex-1" />
          <Skeleton variant="rounded" className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};


// Grid of card skeletons for list loading states
CardSkeleton.Grid = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);


export default CardSkeleton;
