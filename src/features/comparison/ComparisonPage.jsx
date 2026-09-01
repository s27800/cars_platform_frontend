import { useState, useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  IoGitCompareOutline,
  IoTrashOutline,
  IoCarSportOutline,
} from 'react-icons/io5';
import { getCarById } from '../cars/api';
import { Button, Spinner, Alert, Tabs } from '../../shared/components/ui';
import ComparisonTable from './ComparisonTable';
import ComparisonSelector from './ComparisonSelector';
import ComparisonStats from './ComparisonStats';
import { getCarDisplayName, getStorageItem, setStorageItem } from '../../shared/utils/helpers';
import { STALE_TIME, STORAGE_KEYS } from '../../shared/utils/constants';
import { MAX_COMPARISON_CARS } from './constants';


// Side-by-side comparison of the shortlisted cars
const ComparisonPage = () => {
  const { t } = useTranslation('cars');

  const [shortlist, setShortlist] = useState(() =>
    getStorageItem(STORAGE_KEYS.COMPARISON_CARS, [])
  );

  const [activeTab, setActiveTab] = useState('specs');

  const selectedCarIds = shortlist.map(car => car.id);

  // Full data for the cars on the shortlist
  const carQueries = useQueries({
    queries: selectedCarIds.map(id => ({
      queryKey: ['cars', 'detail', id],
      queryFn: () => getCarById(id),
      enabled: !!id,
      staleTime: STALE_TIME.LONG,
    })),
  });

  const isLoading = carQueries.some(q => q.isLoading);
  const cars = carQueries.map(q => q.data).filter(Boolean);

  const persist = useCallback((next) => {
    setShortlist(next);
    setStorageItem(STORAGE_KEYS.COMPARISON_CARS, next);
  }, []);

  const handleAddCar = useCallback((car) => {
    if (shortlist.length >= MAX_COMPARISON_CARS || shortlist.some(item => item.id === car.id))
      return;

    persist([...shortlist, { id: car.id, name: getCarDisplayName(car) }]);
  }, [shortlist, persist]);

  const handleRemoveCar = useCallback((carId) => {
    persist(shortlist.filter(item => item.id !== carId));
  }, [shortlist, persist]);

  const handleClearAll = useCallback(() => persist([]), [persist]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">

      {/* Page header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <IoGitCompareOutline className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {t('comparison.title')}
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('comparison.subtitle', { max: MAX_COMPARISON_CARS })}
                </p>
              </div>
            </div>

            {selectedCarIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <IoTrashOutline className="w-4 h-4 mr-1.5" />
                {t('comparison.clearAll')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Car selector */}
        {selectedCarIds.length < MAX_COMPARISON_CARS && (
          <div className="mb-6">
            <ComparisonSelector
              onSelect={handleAddCar}
              excludeIds={selectedCarIds}
              placeholder={
                selectedCarIds.length === 0
                  ? t('comparison.searchFirst')
                  : t('comparison.addAnother', { current: selectedCarIds.length, max: MAX_COMPARISON_CARS })
              }
            />
          </div>
        )}

        {/* Loading state */}
        {isLoading && selectedCarIds.length > 0 && (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && cars.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6">
              <IoCarSportOutline className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {t('comparison.noCars')}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              {t('comparison.noCarsDescription', { max: MAX_COMPARISON_CARS })}
            </p>
            <Button to="/cars" variant="primary">
              {t('comparison.browseCars')}
            </Button>
          </div>
        )}

        {/* Single car hint */}
        {!isLoading && cars.length === 1 && (
          <Alert variant="info" className="mb-6">
            {t('comparison.addMoreCars')}
          </Alert>
        )}

        {/* Comparison content */}
        {!isLoading && cars.length > 0 && (
          <div className="space-y-6">

            {/* Car cards header */}
            <ComparisonTable.Header
              cars={cars}
              onRemove={handleRemoveCar}
            />

            {/* Tabs for specs/ratings */}
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Trigger value="specs">{t('comparison.specifications')}</Tabs.Trigger>
                <Tabs.Trigger value="ratings">{t('comparison.ratingsAndFuel')}</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="specs">

                {/* Desktop: Side-by-side table */}
                <div className="hidden lg:block">
                  <ComparisonTable cars={cars} />
                </div>

                {/* Mobile: Stacked card layout */}
                <ComparisonTable.Mobile cars={cars} />
              </Tabs.Content>

              <Tabs.Content value="ratings">
                <ComparisonStats carIds={selectedCarIds} />
              </Tabs.Content>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;
