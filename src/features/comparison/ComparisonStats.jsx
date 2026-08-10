import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  IoStarOutline, 
  IoSpeedometerOutline,
  IoFlameOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';
import { getAverageRatings } from '../../api/reviews';
import { getAverageConsumption } from '../../api/fuelReports';
import { Spinner } from '../../components/ui';
import { RATING_CATEGORIES } from '../../utils/constants';


/**
 * Compare average ratings and fuel consumption between cars
 */
const ComparisonStats = ({ carIds = [] }) => {
  const { t } = useTranslation('cars');

  // Fetch ratings
  const ratingsQueries = useQueries({
    queries: carIds.map(id => ({
      queryKey: ['averageRatings', id],
      queryFn: () => getAverageRatings(id),
      enabled: !!id,
      staleTime: 60000,
    })),
  });

  // Fetch consumption
  const consumptionQueries = useQueries({
    queries: carIds.map(id => ({
      queryKey: ['averageConsumption', id],
      queryFn: () => getAverageConsumption(id),
      enabled: !!id,
      staleTime: 60000,
    })),
  });

  const isLoadingRatings = ratingsQueries.some(q => q.isLoading);
  const isLoadingConsumption = consumptionQueries.some(q => q.isLoading);

  if (carIds.length === 0)
    return null;

  return (
    <div className="space-y-6">
      
      {/* Ratings comparison */}
      <RatingsComparison 
        queries={ratingsQueries}
        carIds={carIds}
        isLoading={isLoadingRatings}
        t={t}
      />

      {/* Fuel consumption comparison */}
      <ConsumptionComparison 
        queries={consumptionQueries}
        carIds={carIds}
        isLoading={isLoadingConsumption}
        t={t}
      />
    </div>
  );
};


/**
 * Compare average ratings across all categories
 */
const RatingsComparison = ({ queries, carIds, isLoading, t }) => {
  const [isOpen, setIsOpen] = useState(true);
  const getBackendKey = (key) => `avg${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  
  const hasAnyRatings = queries.some(q => 
    q.data && RATING_CATEGORIES.some(cat => {
      const val = q.data[getBackendKey(cat.key)];
      return val !== null && val > 0;
    })
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <IoStarOutline className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t('stats.averageRatings')}</h3>
        </div>
        <IoChevronDownOutline 
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : !hasAnyRatings ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-6">
            {t('stats.noReviews')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {RATING_CATEGORIES.map(category => {
                  const backendKey = getBackendKey(category.key);
                  const values = queries.map(q => q.data?.[backendKey] ?? null);
                  
                  // Skip if no car has this rating
                  if (values.every(v => v === null || v === 0))
                    return null;

                  // Find best value and check if values differ
                  const validValues = values.filter(v => v !== null && v > 0);
                  const maxValue = Math.max(...validValues);
                  const minValue = Math.min(...validValues);
                  const hasDifferentValues = validValues.length > 1 && maxValue !== minValue;

                  return (
                    <tr 
                      key={category.key}
                      className="border-b border-neutral-100 dark:border-neutral-700 last:border-0"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 w-1/4">
                        {category.label}
                      </td>
                      
                      {values.map((value, idx) => {
                        const isBest = hasDifferentValues && value === maxValue && maxValue > 0;
                        
                        return (
                          <td 
                            key={idx}
                            className={`px-4 py-3 text-center ${
                              isBest 
                                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                                : ''
                            }`}
                          >
                            {value !== null && value > 0 ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <RatingBar value={value} />
                                <span className="text-sm font-medium min-w-[2rem]">
                                  {value.toFixed(1)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-400">—</span>
                            )}
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
      )}
    </div>
  );
};


/**
 * Visual bar representing rating 0-5
 */
const RatingBar = ({ value, maxValue = 5 }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="w-20 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary-500 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};


/**
 * Compare fuel consumption
 */
const ConsumptionComparison = ({ queries, carIds, isLoading, t }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const getConsumptionValue = (data) => {
    if (!data)
      return null;

    return data.averageFuelConsumption ?? null;
  };

  const hasAnyData = queries.some(q => getConsumptionValue(q.data) !== null);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <IoFlameOutline className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">
            {t('stats.fuelConsumption')}
          </h3>
        </div>
        <IoChevronDownOutline 
          className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : !hasAnyData ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-6">
            {t('stats.noFuelReports')}
          </p>
        ) : (
          <div 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${carIds.length}, 1fr)` }}
          >
            {queries.map((query, idx) => {
              const consumption = getConsumptionValue(query.data);
              const allValues = queries
                .map(q => getConsumptionValue(q.data))
                .filter(v => v !== null);
              
              // Check if values differ
              const minValue = allValues.length > 0 ? Math.min(...allValues) : null;
              const maxValue = allValues.length > 0 ? Math.max(...allValues) : null;
              const hasDifferentValues = allValues.length > 1 && minValue !== maxValue;
              
              const isBest = hasDifferentValues 
                && consumption !== null 
                && consumption === minValue;

              return (
                <div 
                  key={carIds[idx]}
                  className={`
                    p-4 rounded-xl text-center
                    ${isBest 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-neutral-50 dark:bg-neutral-700/50'
                    }
                  `}
                >
                  {consumption !== null ? (
                    <>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <IoSpeedometerOutline className={`w-5 h-5 ${
                          isBest ? 'text-green-600 dark:text-green-400' : 'text-neutral-400'
                        }`} />
                        <span className={`text-2xl font-bold ${
                          isBest 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-neutral-900 dark:text-white'
                        }`}>
                          {Number(consumption).toFixed(1)}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          L/100km
                        </span>
                      </div>
                      
                      {isBest && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {t('stats.mostEconomical')}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-neutral-400">{t('stats.noData')}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default ComparisonStats;
