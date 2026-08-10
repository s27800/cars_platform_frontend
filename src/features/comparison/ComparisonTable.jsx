import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    titleKey: 'specs.groups.basic',
    icon: <IoCarSportOutline className="w-5 h-5" />,
    specs: [
      { key: 'brand', labelKey: 'specs.brand', path: 'brand.name' },
      { key: 'model', labelKey: 'specs.model', path: 'model.name' },
      { key: 'generation', labelKey: 'specs.generation', path: 'generation.name' },
      { key: 'productionYears', labelKey: 'specs.productionYears', path: 'productionYears' },
      { key: 'bodyType', labelKey: 'specs.bodyType', path: 'bodyType.name' },
      { key: 'doors', labelKey: 'specs.doors', path: 'doorsNumber' },
      { key: 'seats', labelKey: 'specs.seats', path: 'seatsNumber' },
    ],
  },
  {
    key: 'engine',
    titleKey: 'specs.groups.engine',
    icon: <IoCogOutline className="w-5 h-5" />,
    specs: [
      { key: 'engineCode', labelKey: 'specs.engineCode', path: 'engine.engineCode' },
      { key: 'displacement', labelKey: 'specs.displacement', path: 'engine.displacement', unit: 'cc' },
      { key: 'engineType', labelKey: 'specs.fuelType', path: 'engine.engineType' },
      { key: 'maxPower', labelKey: 'specs.maxPower', path: 'engine.maxPower', unit: 'HP', compare: 'higher' },
      { key: 'maxPowerRpm', labelKey: 'specs.maxPowerRpm', path: 'engine.maxPowerRotationSpeed', unit: 'rpm' },
      { key: 'maxTorque', labelKey: 'specs.maxTorque', path: 'engine.maxTorque', unit: 'Nm', compare: 'higher' },
      { key: 'maxTorqueRpm', labelKey: 'specs.maxTorqueRpm', path: 'engine.maxTorqueRotationSpeed', unit: 'rpm' },
      { key: 'cylinders', labelKey: 'specs.cylinders', path: 'engine.cylindersNumber' },
      { key: 'turbo', labelKey: 'specs.turbo', path: 'engine.turbo' },
    ],
  },
  {
    key: 'transmission',
    titleKey: 'specs.groups.transmission',
    icon: <IoSettingsOutline className="w-5 h-5" />,
    specs: [
      { key: 'transmissionType', labelKey: 'specs.transmissionType', path: 'transmission.transmissionType' },
      { key: 'gears', labelKey: 'specs.gears', path: 'transmission.gearsNumber' },
      { key: 'clutch', labelKey: 'specs.clutch', path: 'transmission.clutchType' },
    ],
  },
  {
    key: 'performance',
    titleKey: 'specs.groups.performance',
    icon: <IoSpeedometerOutline className="w-5 h-5" />,
    specs: [
      { key: 'maxSpeed', labelKey: 'specs.topSpeed', path: 'performance.maxSpeed', unit: 'km/h', compare: 'higher' },
      { key: 'acceleration', labelKey: 'specs.acceleration', path: 'performance.acceleration0100', unit: 's', compare: 'lower' },
      { key: 'consumptionCity', labelKey: 'specs.consumptionCity', path: 'performance.fuelConsumptionCity', unit: 'L/100km', compare: 'lower' },
      { key: 'consumptionHighway', labelKey: 'specs.consumptionHighway', path: 'performance.fuelConsumptionRoute', unit: 'L/100km', compare: 'lower' },
      { key: 'consumptionMixed', labelKey: 'specs.consumptionMixed', path: 'performance.fuelConsumptionMixed', unit: 'L/100km', compare: 'lower' },
      { key: 'fuelTank', labelKey: 'specs.fuelTank', path: 'performance.fuelTankCapacity', unit: 'L' },
    ],
  },
  {
    key: 'chassis',
    titleKey: 'specs.groups.chassis',
    icon: <IoLayersOutline className="w-5 h-5" />,
    specs: [
      { key: 'drive', labelKey: 'specs.drive', path: 'chassis.drive' },
      { key: 'frontBrakes', labelKey: 'specs.frontBrakes', path: 'chassis.frontBrakes' },
      { key: 'rearBrakes', labelKey: 'specs.rearBrakes', path: 'chassis.backBrakes' },
      { key: 'frontBrakesRadius', labelKey: 'specs.frontBrakesRadius', path: 'chassis.frontBrakesRadius', unit: 'mm' },
      { key: 'rearBrakesRadius', labelKey: 'specs.rearBrakesRadius', path: 'chassis.backBrakesRadius', unit: 'mm' },
      { key: 'suspension', labelKey: 'specs.suspension', path: 'chassis.suspension' },
    ],
  },
  {
    key: 'dimensions',
    titleKey: 'specs.groups.dimensions',
    icon: <IoResizeOutline className="w-5 h-5" />,
    specs: [
      { key: 'length', labelKey: 'specs.length', path: 'outsideDimensions.length', unit: 'mm' },
      { key: 'width', labelKey: 'specs.width', path: 'outsideDimensions.width', unit: 'mm' },
      { key: 'height', labelKey: 'specs.height', path: 'outsideDimensions.height', unit: 'mm' },
      { key: 'wheelbase', labelKey: 'specs.wheelbase', path: 'outsideDimensions.wheelBase', unit: 'mm' },
      { key: 'clearance', labelKey: 'specs.clearance', path: 'outsideDimensions.clearance', unit: 'mm' },
      { key: 'trunkMin', labelKey: 'specs.trunkMin', path: 'insideDimensions.minTrunkSpace', unit: 'L', compare: 'higher' },
      { key: 'trunkMax', labelKey: 'specs.trunkMax', path: 'insideDimensions.maxTrunkSpace', unit: 'L', compare: 'higher' },
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
const formatValue = (value, unit, t) => {
  if (value === null || value === undefined || value === '')
    return '—';

  if (typeof value === 'boolean')
    return value ? t('common.yes') : t('common.no');

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
  const { t } = useTranslation('cars');
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
          t={t}
        />
      ))}
    </div>
  );
};


/**
 * Single specification comparison group
 */
const ComparisonGroup = ({ group, cars, defaultOpen = true, t }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { titleKey, icon, specs } = group;

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
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t(titleKey)}</h3>
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
                    {t(spec.labelKey)}
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
                        {formatValue(value, spec.unit, t)}
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
 * Mobile-friendly card view for comparison
 */
const MobileComparisonCards = ({ cars, group, t }) => {
  const { specs } = group;
  
  return (
    <div className="space-y-4">
      {cars.map((car, carIndex) => (
        <div key={car.id} className="space-y-2">

          {/* Car name header */}
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
            <span className={`w-3 h-3 rounded-full ${carIndex === 0 ? 'bg-primary-500' : 'bg-amber-500'}`} />
            <span className="font-medium text-neutral-900 dark:text-white truncate">
              {car.name || `${car.brand?.name} ${car.model?.name}`}
            </span>
          </div>
          
          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2">
            {specs.map(spec => {
              const value = getNestedValue(car, spec.path);
              if (value === null || value === undefined) return null;
              
              return (
                <div key={spec.key} className="py-2">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{t(spec.labelKey)}</div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatValue(value, spec.unit, t)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};


/**
 * Mobile-optimized comparison group with card layout
 */
const MobileComparisonGroup = ({ group, cars, defaultOpen = true, t }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { titleKey, icon, specs } = group;

  const hasData = specs.some(spec => 
    cars.some(car => getNestedValue(car, spec.path) !== null)
  );

  if (!hasData)
    return null;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t(titleKey)}</h3>
        </div>
        <IoChevronDownOutline 
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="p-4">
          <MobileComparisonCards cars={cars} group={group} t={t} />
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


/**
 * Mobile-specific comparison layout
 */
ComparisonTable.Mobile = ({ cars }) => {
  const validCars = useMemo(() => cars.filter(Boolean), [cars]);

  if (validCars.length === 0)
    return null;

  return (
    <div className="space-y-4 lg:hidden">

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm">
        {validCars.map((car, idx) => (
          <div key={car.id} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-primary-500' : 'bg-amber-500'}`} />
            <span className="text-neutral-600 dark:text-neutral-400 truncate max-w-[120px]">
              {car.brand?.name} {car.model?.name}
            </span>
          </div>
        ))}
      </div>
      
      {SPEC_GROUPS.map(group => (
        <MobileComparisonGroup 
          key={group.key}
          group={group}
          cars={validCars}
        />
      ))}
    </div>
  );
};


export default ComparisonTable;
