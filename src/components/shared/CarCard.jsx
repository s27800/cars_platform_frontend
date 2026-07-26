import { Link } from 'react-router-dom';
import { 
  IoSpeedometerOutline, 
  IoFlashOutline, 
  IoCogOutline,
  IoAddOutline,
  IoCheckmarkOutline,
} from 'react-icons/io5';
import { Badge, Button } from '../ui';


const CarCard = ({
  car,
  isInComparison = false,
  onToggleComparison,
  className = '',
}) => {
  const {
    id,
    name,
    imageUrl,
    productionYears,
    brand,
    model,
    generation,
    engine,
    chassis,
    performance,
    photos = [],
  } = car;

  const mainPhoto = imageUrl || (photos.length > 0 ? photos[0].url : null);
  
  const carName = name || `${brand?.name || ''} ${model?.name || ''} ${generation?.name || ''}`.trim();
  
  const yearRange = productionYears || (generation 
    ? `${generation.startYear}${generation.endYear ? ` - ${generation.endYear}` : '+'}`
    : null);

  return (
    <div className={`
      bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden
      border border-neutral-200 dark:border-neutral-700
      hover:shadow-lg transition-all duration-300 hover:-translate-y-1
      ${className}
    `}>
      <Link to={`/cars/${id}`} className="block">
        <div className="aspect-[16/10] bg-neutral-100 dark:bg-neutral-700 relative overflow-hidden">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={carName}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <IoCogOutline className="w-16 h-16" />
            </div>
          )}
          
          {yearRange && (
            <Badge 
              variant="default" 
              className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-800/90"
            >
              {yearRange}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/cars/${id}`}>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
            {carName || 'Unknown Car'}
          </h3>
        </Link>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(engine?.power || engine?.maxPower) && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <IoFlashOutline className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>{engine.power || engine.maxPower} HP</span>
            </div>
          )}
          
          {engine?.displacement && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <IoCogOutline className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>{(engine.displacement / 1000).toFixed(1)}L</span>
            </div>
          )}
          
          {performance?.topSpeed && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <IoSpeedometerOutline className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>{performance.topSpeed} km/h</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {engine?.engineType && (
            <Badge variant="primary" size="sm">
              {engine.engineType}
            </Badge>
          )}
          {chassis?.drive && (
            <Badge variant="default" size="sm">
              {chassis.drive}
            </Badge>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            to={`/cars/${id}`}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Details
          </Button>
          
          {onToggleComparison && (
            <Button
              variant={isInComparison ? 'secondary' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                onToggleComparison(car);
              }}
              leftIcon={isInComparison 
                ? <IoCheckmarkOutline className="w-4 h-4" /> 
                : <IoAddOutline className="w-4 h-4" />
              }
            >
              {isInComparison ? 'Added' : 'Compare'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
