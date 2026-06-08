import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoCogOutline,
  IoSpeedometerOutline,
  IoSettingsOutline,
  IoResizeOutline,
  IoLayersOutline,
  IoFlashOutline,
  IoCarSportOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';


// Specification groups with their fields for comparison
const SPEC_GROUPS = [
  {
    key: 'basic',
    title: 'Basic Info',
    icon: <IoCarSportOutline className="w-5 h-5" />,
    specs: [
      { key: 'brand', label: 'Brand', path: 'brand.name' },
      { key: 'model', label: 'Model', path: 'model.name' },
      { key: 'generation', label: 'Generation', path: 'generation.name' },
      { key: 'productionYears', label: 'Production Years', path: 'productionYears' },
      { key: 'bodyType', label: 'Body Type', path: 'bodyType.name' },
      { key: 'doors', label: 'Doors', path: 'doorsNumber' },
      { key: 'seats', label: 'Seats', path: 'seatsNumber' },
    ],
  },
  {
    key: 'engine',
    title: 'Engine',
    icon: <IoCogOutline className="w-5 h-5" />,
    specs: [
      { key: 'engineCode', label: 'Engine Code', path: 'engine.engineCode' },
      { key: 'displacement', label: 'Displacement', path: 'engine.displacement', unit: 'cc' },
      { key: 'engineType', label: 'Fuel Type', path: 'engine.engineType' },
      { key: 'maxPower', label: 'Max Power', path: 'engine.maxPower', unit: 'HP', compare: 'higher' },
      { key: 'maxPowerRpm', label: 'Max Power RPM', path: 'engine.maxPowerRotationSpeed', unit: 'rpm' },
      { key: 'maxTorque', label: 'Max Torque', path: 'engine.maxTorque', unit: 'Nm', compare: 'higher' },
      { key: 'maxTorqueRpm', label: 'Max Torque RPM', path: 'engine.maxTorqueRotationSpeed', unit: 'rpm' },
      { key: 'cylinders', label: 'Cylinders', path: 'engine.cylindersNumber' },
      { key: 'turbo', label: 'Turbo', path: 'engine.turbo' },
    ],
  },
  {
    key: 'transmission',
    title: 'Transmission',
    icon: <IoSettingsOutline className="w-5 h-5" />,
    specs: [
      { key: 'transmissionType', label: 'Type', path: 'transmission.transmissionType' },
      { key: 'gears', label: 'Gears', path: 'transmission.gearsNumber' },
      { key: 'clutch', label: 'Clutch', path: 'transmission.clutchType' },
    ],
  },
  {
    key: 'performance',
    title: 'Performance',
    icon: <IoSpeedometerOutline className="w-5 h-5" />,
    specs: [
      { key: 'maxSpeed', label: 'Top Speed', path: 'performance.maxSpeed', unit: 'km/h', compare: 'higher' },
      { key: 'acceleration', label: '0-100 km/h', path: 'performance.acceleration0100', unit: 's', compare: 'lower' },
      { key: 'consumptionCity', label: 'City Consumption', path: 'performance.fuelConsumptionCity', unit: 'L/100km', compare: 'lower' },
      { key: 'consumptionHighway', label: 'Highway Consumption', path: 'performance.fuelConsumptionRoute', unit: 'L/100km', compare: 'lower' },
      { key: 'consumptionMixed', label: 'Mixed Consumption', path: 'performance.fuelConsumptionMixed', unit: 'L/100km', compare: 'lower' },
      { key: 'fuelTank', label: 'Fuel Tank', path: 'performance.fuelTankCapacity', unit: 'L' },
    ],
  },
  {
    key: 'chassis',
    title: 'Chassis & Brakes',
    icon: <IoLayersOutline className="w-5 h-5" />,
    specs: [
      { key: 'drive', label: 'Drive', path: 'chassis.drive' },
      { key: 'frontBrakes', label: 'Front Brakes', path: 'chassis.frontBrakes' },
      { key: 'rearBrakes', label: 'Rear Brakes', path: 'chassis.backBrakes' },
      { key: 'frontBrakesRadius', label: 'Front Brakes Ø', path: 'chassis.frontBrakesRadius', unit: 'mm' },
      { key: 'rearBrakesRadius', label: 'Rear Brakes Ø', path: 'chassis.backBrakesRadius', unit: 'mm' },
      { key: 'suspension', label: 'Suspension', path: 'chassis.suspension' },
    ],
  },
  {
    key: 'dimensions',
    title: 'Dimensions',
    icon: <IoResizeOutline className="w-5 h-5" />,
    specs: [
      { key: 'length', label: 'Length', path: 'outsideDimensions.length', unit: 'mm' },
      { key: 'width', label: 'Width', path: 'outsideDimensions.width', unit: 'mm' },
      { key: 'height', label: 'Height', path: 'outsideDimensions.height', unit: 'mm' },
      { key: 'wheelbase', label: 'Wheelbase', path: 'outsideDimensions.wheelBase', unit: 'mm' },
      { key: 'clearance', label: 'Ground Clearance', path: 'outsideDimensions.clearance', unit: 'mm' },
      { key: 'trunkMin', label: 'Trunk (min)', path: 'insideDimensions.minTrunkSpace', unit: 'L', compare: 'higher' },
      { key: 'trunkMax', label: 'Trunk (max)', path: 'insideDimensions.maxTrunkSpace', unit: 'L', compare: 'higher' },
    ],
  },
];


/**
 * Get nested property value from object using dot notation path
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path)
    return null;
  
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};


/**
 * Format value with unit for display
 */
const formatValue = (value, unit) => {
  if (value === null || value === undefined || value === '')
    return '—';

  if (typeof value === 'boolean')
    return value ? 'Yes' : 'No';

  return unit ? `${value} ${unit}` : String(value);
};


/**
 * Determine which value is better
 */
const compareValues = (val1, val2, compareType) => {
  if (!compareType || val1 === null || val2 === null)
    return null;
  
  const num1 = parseFloat(val1);
  const num2 = parseFloat(val2);
  
  if (isNaN(num1) || isNaN(num2)) return null;
  if (num1 === num2) return 'equal';

  if (compareType === 'higher')
    return num1 > num2 ? 'first' : 'second';
  else
    return num1 < num2 ? 'first' : 'second';
};


/**
 * Table component for comparing car specifications side by side.
 */
const ComparisonTable = ({ cars = [] }) => {
  const validCars = useMemo(() => cars.filter(Boolean), [cars]);

  if (validCars.length === 0)
    return null;

  return (
    <div className="space-y-6">
      {SPEC_GROUPS.map(group => (
        <ComparisonGroup 
          key={group.key}
          group={group}
          cars={validCars}
        />
      ))}
    </div>
  );
};


/**
 * Single specification comparison group
 */
const ComparisonGroup = ({ group, cars, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { title, icon, specs } = group;

  const hasData = specs.some(spec => 
    cars.some(car => getNestedValue(car, spec.path) !== null)
  );

  if (!hasData)
    return null;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      
      {/* Group header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{title}</h3>
        </div>
        <IoChevronDownOutline 
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Specifications table */}
      {isOpen && (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {specs.map(spec => {
              const values = cars.map(car => getNestedValue(car, spec.path));
              
              // Skip row if no car has this value
              if (values.every(v => v === null || v === undefined))
                return null;

              // Determine which value is better
              const comparison = cars.length === 2 
                ? compareValues(values[0], values[1], spec.compare)
                : null;

              return (
                <tr 
                  key={spec.key}
                  className="border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                >
                  <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 w-1/4 min-w-[140px]">
                    {spec.label}
                  </td>
                  
                  {values.map((value, idx) => {
                    const isBetter = comparison === (idx === 0 ? 'first' : 'second');
                    
                    return (
                      <td 
                        key={idx}
                        className={`
                          px-4 py-3 text-sm font-medium text-center
                          ${isBetter 
                            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                            : 'text-neutral-900 dark:text-white'
                          }
                        `}
                      >
                        {formatValue(value, spec.unit)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};


/**
 * Header row showing car names and images
 */
ComparisonTable.Header = ({ cars, onRemove }) => {
  const validCars = cars.filter(Boolean);

  if (validCars.length === 0)
    return null;

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${validCars.length}, 1fr)` }}>
      {validCars.map((car, idx) => (
        <div 
          key={car.id}
          className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4"
        >
          {/* Car image */}
          <div className="aspect-[16/10] bg-neutral-100 dark:bg-neutral-700 rounded-xl overflow-hidden mb-4">
            {car.images?.[0]?.imageUrl ? (
              <img 
                src={car.images[0].imageUrl} 
                alt={car.name || 'Car'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IoCarSportOutline className="w-12 h-12 text-neutral-400" />
              </div>
            )}
          </div>

          {/* Car name */}
          <Link 
            to={`/cars/${car.id}`}
            className="block text-lg font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 text-center"
          >
            {car.name || `${car.brand?.name} ${car.model?.name}`}
          </Link>

          {/* Quick specs */}
          <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            {car.engine?.maxPower && <span>{car.engine.maxPower} HP</span>}
            {car.chassis?.drive && <span>• {car.chassis.drive}</span>}
          </div>

          {/* Remove button */}
          {onRemove && (
            <button
              onClick={() => onRemove(car.id)}
              className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Remove from comparison
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComparisonTable;
