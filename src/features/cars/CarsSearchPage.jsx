import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline, IoFilterOutline, IoCarSportOutline } from 'react-icons/io5';
import { searchCars } from './api';
import CarCard from './CarCard';
import FiltersPanel from './FiltersPanel';
import { Input, Select, Pagination, Button, CardSkeleton } from '../../shared/components/ui';
import { useDebounce } from '../../shared/hooks';


// Search results with the filter panel
const CarsSearchPage = () => {
  const { t } = useTranslation('cars');
  const { t: tCommon } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize search from URL param
  const urlSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Sync URL search param with local state on URL change
  const [lastUrlSearch, setLastUrlSearch] = useState(urlSearch);

  if (lastUrlSearch !== urlSearch) {
    setLastUrlSearch(urlSearch);
    setSearchQuery(urlSearch);
  }

  const SORT_OPTIONS = [
    { value: '', label: t('search.sortDefault') },
    { value: 'name,asc', label: t('search.sortNameAsc') },
    { value: 'name,desc', label: t('search.sortNameDesc') },
    { value: 'engine.power,desc', label: t('search.sortPowerDesc') },
    { value: 'engine.power,asc', label: t('search.sortPowerAsc') },
  ];

  const PAGE_SIZE_OPTIONS = [
    { value: '12', label: t('search.perPage', { count: 12 }) },
    { value: '24', label: t('search.perPage', { count: 24 }) },
    { value: '48', label: t('search.perPage', { count: 48 }) },
  ];

  const filters = useMemo(() => ({
    brandIds: searchParams.get('brandIds')?.split(',').filter(Boolean) || [],
    modelIds: searchParams.get('modelIds')?.split(',').filter(Boolean) || [],
    generationIds: searchParams.get('generationIds')?.split(',').filter(Boolean) || [],
    bodyTypeIds: searchParams.get('bodyTypeIds')?.split(',').filter(Boolean) || [],
    tagIds: searchParams.get('tagIds')?.split(',').filter(Boolean) || [],
    engineTypes: searchParams.get('engineTypes')?.split(',').filter(Boolean) || [],
    drives: searchParams.get('drives')?.split(',').filter(Boolean) || [],
    transmissionTypes: searchParams.get('transmissionTypes')?.split(',').filter(Boolean) || [],
    minPower: searchParams.get('minPower') ? Number(searchParams.get('minPower')) : undefined,
    maxPower: searchParams.get('maxPower') ? Number(searchParams.get('maxPower')) : undefined,
    minDisplacement: searchParams.get('minDisplacement') ? Number(searchParams.get('minDisplacement')) : undefined,
    maxDisplacement: searchParams.get('maxDisplacement') ? Number(searchParams.get('maxDisplacement')) : undefined,
  }), [searchParams]);

  const page = Number(searchParams.get('page')) || 0;
  const size = Number(searchParams.get('size')) || 12;
  const sort = searchParams.get('sort') || '';

  const queryParams = useMemo(() => {
    const params = { page, size };

    if (debouncedSearch) params.search = debouncedSearch;
    if (sort) params.sort = sort;
    if (filters.brandIds.length) params.brandIds = filters.brandIds;
    if (filters.modelIds.length) params.modelIds = filters.modelIds;
    if (filters.generationIds.length) params.generationIds = filters.generationIds;
    if (filters.bodyTypeIds.length) params.bodyTypeIds = filters.bodyTypeIds;
    if (filters.tagIds.length) params.tagIds = filters.tagIds;
    if (filters.engineTypes.length) params.engineTypes = filters.engineTypes;
    if (filters.drives.length) params.drives = filters.drives;
    if (filters.transmissionTypes.length) params.transmissionTypes = filters.transmissionTypes;
    if (filters.minPower) params.minPower = filters.minPower;
    if (filters.maxPower) params.maxPower = filters.maxPower;
    if (filters.minDisplacement) params.minDisplacement = filters.minDisplacement;
    if (filters.maxDisplacement) params.maxDisplacement = filters.maxDisplacement;

    return params;
  }, [page, size, sort, filters, debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cars', 'search', queryParams],
    queryFn: () => searchCars(queryParams),
    placeholderData: keepPreviousData,
  });

  const cars = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, value.toString());
      }
    });

    setSearchParams(newParams);
  };

  const handleFiltersChange = (newFilters) => {
    updateSearchParams({
      ...newFilters,
      page: 0,
    });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL when search changes
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    updateSearchParams({ sort: e.target.value, page: 0 });
  };

  const handleSizeChange = (e) => {
    updateSearchParams({ size: e.target.value, page: 0 });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <IoCarSportOutline className="w-8 h-8 text-primary-600" />
            {t('search.title')}
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {t('search.subtitle')}
          </p>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('search.searchPlaceholder')}
                    leftIcon={<IoSearchOutline className="w-5 h-5" />}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowMobileFilters(true)}
                    leftIcon={<IoFilterOutline className="w-5 h-5" />}
                  >
                    {t('filters.title')}
                  </Button>

                  <Select
                    options={SORT_OPTIONS}
                    value={sort}
                    onChange={handleSortChange}
                    className="w-44"
                  />

                  <Select
                    options={PAGE_SIZE_OPTIONS}
                    value={size.toString()}
                    onChange={handleSizeChange}
                    className="w-32 hidden sm:block"
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {isLoading ? (
                  tCommon('buttons.loading')
                ) : (
                  t('search.showingResults', { count: cars.length, total: totalElements })
                )}
              </div>
            </div>

            {isLoading ? (
              <CardSkeleton.Grid count={size} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
            ) : isError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400">
                  {error?.message || tCommon('errors.loadFailed')}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  {tCommon('retry')}
                </Button>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                <IoCarSportOutline className="w-16 h-16 mx-auto text-neutral-400" />
                <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                  {t('search.noResults')}
                </h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  {t('search.noResultsHint')}
                </p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleResetFilters}
                >
                  {t('filters.clearAll')}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      totalElements={totalElements}
                      pageSize={size}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <FiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          isMobile
          onClose={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default CarsSearchPage;
