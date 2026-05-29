import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { IoSearchOutline, IoFilterOutline, IoCarSportOutline } from 'react-icons/io5';
import { searchCars } from '../api/cars';
import { CarCard, FiltersPanel } from '../components/shared';
import { Input, Select, Pagination, Spinner, Button } from '../components/ui';
import { useDebounce } from '../hooks';


const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'name,asc', label: 'Car name A-Z' },
  { value: 'name,desc', label: 'Car name Z-A' },
  { value: 'engine.power,desc', label: 'Power: High to Low' },
  { value: 'engine.power,asc', label: 'Power: Low to High' },
];

const PAGE_SIZE_OPTIONS = [
  { value: '12', label: '12 per page' },
  { value: '24', label: '24 per page' },
  { value: '48', label: '48 per page' },
];


const CarsSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const filters = useMemo(() => ({
    brandIds: searchParams.get('brandIds')?.split(',').map(Number).filter(Boolean) || [],
    modelIds: searchParams.get('modelIds')?.split(',').map(Number).filter(Boolean) || [],
    generationIds: searchParams.get('generationIds')?.split(',').map(Number).filter(Boolean) || [],
    bodyTypeIds: searchParams.get('bodyTypeIds')?.split(',').map(Number).filter(Boolean) || [],
    tagIds: searchParams.get('tagIds')?.split(',').map(Number).filter(Boolean) || [],
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
  }, [page, size, sort, filters]);

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

  const filteredCars = useMemo(() => {
    if (!debouncedSearch) return cars;
    
    const query = debouncedSearch.toLowerCase();
    return cars.filter(car => {
      const name = `${car.brand?.name || ''} ${car.model?.name || ''} ${car.generation?.name || ''}`.toLowerCase();
      return name.includes(query);
    });
  }, [cars, debouncedSearch]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <IoCarSportOutline className="w-8 h-8 text-primary-600" />
            Car Search
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Browse and filter through our car database
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
                    placeholder="Search cars..."
                    leftIcon={<IoSearchOutline className="w-5 h-5" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setShowMobileFilters(true)}
                    leftIcon={<IoFilterOutline className="w-5 h-5" />}
                  >
                    Filters
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
                  'Loading...'
                ) : (
                  <>
                    Showing <span className="font-medium">{filteredCars.length}</span> of{' '}
                    <span className="font-medium">{totalElements}</span> results
                  </>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
              </div>
            ) : isError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                <p className="text-red-600 dark:text-red-400">
                  {error?.message || 'Failed to load cars. Please try again.'}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                <IoCarSportOutline className="w-16 h-16 mx-auto text-neutral-400" />
                <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">
                  No cars found
                </h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCars.map((car) => (
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
