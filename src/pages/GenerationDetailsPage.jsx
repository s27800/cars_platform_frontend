import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigationType } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  IoChevronBackOutline,
  IoCarSportOutline,
  IoLayersOutline,
  IoGridOutline,
} from 'react-icons/io5';
import { getGenerationById } from '../api/generations';
import { Button, Spinner, Badge, Pagination } from '../components/ui';
import { CarCard } from '../components/shared';
import { getStorageItem, setStorageItem } from '../utils/helpers';
import { MAX_COMPARISON_CARS, STORAGE_KEYS } from '../utils/constants';


const CARS_PER_PAGE = 12;


const GenerationDetailsPage = () => {
  const { id } = useParams();
  const navigationType = useNavigationType();
  const { t } = useTranslation('cars');
  const { t: tBrands } = useTranslation('brands');
  const { t: tCommon } = useTranslation('common');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Comparison state
  const [comparisonCars, setComparisonCars] = useState(() => 
    getStorageItem(STORAGE_KEYS.COMPARISON_CARS, [])
  );

  // Scroll to top only on new navigation
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [id, navigationType]);

  // Reset pagination when generation changes
  const [lastGenerationId, setLastGenerationId] = useState(id);

  if (lastGenerationId !== id) {
    setLastGenerationId(id);
    setCurrentPage(0);
  }

  const { data: generation, isLoading, isError, error } = useQuery({
    queryKey: ['generation', id],
    queryFn: () => getGenerationById(id),
    enabled: !!id,
  });

  // Paginate cars
  const paginatedCars = useMemo(() => {
    if (!generation?.cars) return { content: [], totalPages: 0, totalElements: 0 };
    
    const cars = generation.cars;
    const totalElements = cars.length;
    const totalPages = Math.ceil(totalElements / CARS_PER_PAGE);
    const startIndex = currentPage * CARS_PER_PAGE;
    const content = cars.slice(startIndex, startIndex + CARS_PER_PAGE);
    
    return { content, totalPages, totalElements };
  }, [generation?.cars, currentPage]);

  // Handle comparison toggle
  const handleToggleComparison = (car) => {
    const isInComparison = comparisonCars.some(c => c.id === car.id);
    let newList;

    if (isInComparison) {
      newList = comparisonCars.filter(c => c.id !== car.id);
    } else {
      if (comparisonCars.length >= MAX_COMPARISON_CARS) {
        alert(t('comparison.maxCarsWarning', { count: MAX_COMPARISON_CARS }));
        return;
      }
      // Store minimal car info for comparison
      newList = [...comparisonCars, {
        id: car.id,
        name: car.name,
        imageUrl: car.imageUrl,
        brand: generation.brand,
        model: generation.model,
        generation: { id: generation.id, name: generation.name },
        engine: car.engine,
      }];
    }

    setComparisonCars(newList);
    setStorageItem(STORAGE_KEYS.COMPARISON_CARS, newList);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <IoLayersOutline className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{t('generation.errorTitle')}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.response?.status === 404
              ? t('generation.errorNotFound')
              : t('generation.errorDescription')
            }
          </p>
          <Button to="/" variant="primary">{tCommon('goHome')}</Button>
        </div>
      </div>
    );
  }

  const {
    name,
    model,
    brand,
    cars = [],
  } = generation;

  const totalCars = cars.length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">

      {/* Breadcrumb navigation */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link
              to="/"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
            >
              <IoChevronBackOutline className="w-4 h-4" />
              {tCommon('navigation.home')}
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to="/brands"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {tBrands('breadcrumb')}
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to={`/brands/${brand?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {brand?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <Link
              to={`/models/${model?.id}`}
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {model?.name}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 dark:text-white font-medium truncate">
              {name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Generation header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Generation icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <IoLayersOutline className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </div>

            {/* Generation info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {brand?.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : null}
                <span className="text-neutral-500 dark:text-neutral-400 text-lg">
                  {brand?.name} {model?.name}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="primary" size="md">
                  <IoCarSportOutline className="w-3.5 h-3.5 mr-1" />
                  {t('generation.carsCount', { count: totalCars })}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              <Button
                to={`/cars?brandIds=${brand?.id}&modelIds=${model?.id}&generationIds=${id}`}
                variant="primary"
                leftIcon={<IoCarSportOutline className="w-4 h-4" />}
              >
                {t('generation.searchAllCars')}
              </Button>
              {comparisonCars.length > 0 && (
                <Button
                  to="/comparison"
                  variant="outline"
                  size="sm"
                >
                  {t('comparison.viewComparison', { count: comparisonCars.length })}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <QuickStat
            icon={<IoCarSportOutline className="w-5 h-5" />}
            label={t('generation.stats.cars')}
            value={totalCars}
          />
          <QuickStat
            icon={<IoGridOutline className="w-5 h-5" />}
            label={t('generation.stats.model')}
            value={model?.name || tBrands('stats.notAvailable')}
          />
          <QuickStat
            icon={<IoCarSportOutline className="w-5 h-5" />}
            label={t('generation.stats.brand')}
            value={brand?.name || tBrands('stats.notAvailable')}
          />
        </div>

        {/* Cars section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {t('generation.carsSection.title')}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {t('generation.carsSection.subtitle')}
              </p>
            </div>
          </div>

          {cars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedCars.content.map((car) => (
                  <CarCard
                    key={car.id}
                    car={{
                      ...car,
                      brand,
                      model,
                      generation: { id: generation.id, name: generation.name },
                    }}
                    isInComparison={comparisonCars.some(c => c.id === car.id)}
                    onToggleComparison={handleToggleComparison}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginatedCars.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginatedCars.totalPages}
                    totalElements={paginatedCars.totalElements}
                    pageSize={CARS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <IoCarSportOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">
                {t('generation.carsSection.empty')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const QuickStat = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
      {icon}
    </div>
    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
      {value}
    </div>
    <div className="text-sm text-neutral-500 dark:text-neutral-400">
      {label}
    </div>
  </div>
);


export default GenerationDetailsPage;
