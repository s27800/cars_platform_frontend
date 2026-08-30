import { useTranslation } from 'react-i18next';
import { Rating } from '../../components/ui';
import { RATING_CATEGORIES } from '../../utils/constants';
import { calculateAverage } from '../../utils/helpers';


// Map API field names
const RATING_LABEL_KEYS = Object.fromEntries(
  RATING_CATEGORIES.map(cat => [`avg${cat.key.charAt(0).toUpperCase()}${cat.key.slice(1)}`, cat.labelKey])
);

RATING_LABEL_KEYS.avgFailureFreeRating = 'reliability';


// Reusable bar chart component showing average ratings across all categories
const RatingsChart = ({ averageRatings, className = '' }) => {
  const { t } = useTranslation('reviews');

  if (!averageRatings) {
    return (
      <div className={`text-center py-8 text-neutral-500 dark:text-neutral-400 ${className}`}>
        {t('empty.noReviews')}
      </div>
    );
  }

  const ratingEntries = Object.entries(averageRatings)
    .filter(([key, value]) => key.startsWith('avg') && value !== null && RATING_LABEL_KEYS[key])
    .sort(([, a], [, b]) => b - a);

  const overallAverage = calculateAverage(ratingEntries.map(([, v]) => v));

  if (ratingEntries.length === 0) {
    return (
      <div className={`text-center py-8 text-neutral-500 dark:text-neutral-400 ${className}`}>
        {t('empty.noReviews')}
      </div>
    );
  }

  return (
    <div className={className}>

      {/* Overall summary */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{t('ratings.overall')}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Rating value={overallAverage} readonly size="lg" />
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              {overallAverage.toFixed(1)}
            </span>
          </div>
        </div>
        <span className="text-sm text-neutral-500">{t('basedOnCategories', 'Based on {{count}} categories', { count: ratingEntries.length })}</span>
      </div>

      {/* Category bars */}
      <div className="space-y-3">
        {ratingEntries.map(([key, value]) => (
          <RatingBar
            key={key}
            label={t(`ratings.${RATING_LABEL_KEYS[key]}`)}
            value={value}
          />
        ))}
      </div>
    </div>
  );
};


// Sub-component for individual rating bars
const RatingBar = ({ label, value, maxValue = 5 }) => {
  const percentage = (value / maxValue) * 100;

  // Color based on rating value
  const getBarColor = (val) => {
    if (val >= 4)
      return 'bg-green-500';
    
    if (val >= 3)
      return 'bg-yellow-500';
    
    if (val >= 2)
      return 'bg-orange-500';
    
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-4">
      <span className="w-32 text-sm text-neutral-600 dark:text-neutral-400 flex-shrink-0">
        {label}
      </span>
      
      <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor(value)} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className="w-10 text-sm font-medium text-neutral-900 dark:text-white text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingsChart;
