import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline, IoAddOutline, IoCloseOutline } from 'react-icons/io5';
import { searchCars } from '../../api/cars';
import { Input, Spinner } from '../../components/ui';
import { useDebounce } from '../../hooks';


/**
 * Search input with dropdown results for selecting cars to compare
 */
const ComparisonSelector = ({ 
  onSelect, 
  excludeIds = [],
  placeholder,
}) => {
  const { t } = useTranslation('cars');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['carSearch', debouncedQuery],
    queryFn: () => searchCars({ 
      search: debouncedQuery,
      size: 8,
      page: 0,
    }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000,
  });

  // Filter out already selected cars
  const filteredResults = data?.content?.filter(
    car => !excludeIds.includes(car.id)
  ) || [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((car) => {
    onSelect(car);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onSelect]);

  const handleInputFocus = () => {
    if (query.length >= 2)
      setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showResults = isOpen && debouncedQuery.length >= 2;
  const showLoading = isLoading || isFetching;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder || t('comparison.searchFirst')}
          leftIcon={<IoSearchOutline className="w-5 h-5" />}
          rightIcon={
            query ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full transition-colors"
              >
                <IoCloseOutline className="w-4 h-4" />
              </button>
            ) : null
          }
        />
      </div>

      {/* Dropdown results */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden">
          
          {showLoading && (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" />
            </div>
          )}

          {!showLoading && filteredResults.length === 0 && (
            <div className="px-4 py-6 text-center text-neutral-500 dark:text-neutral-400">
              {t('stats.noResults')} "{debouncedQuery}"
            </div>
          )}

          {!showLoading && filteredResults.length > 0 && (
            <ul className="max-h-72 overflow-y-auto">
              {filteredResults.map(car => (
                <li key={car.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(car)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
                  >
                    
                    {/* Car thumbnail */}
                    <div className="w-16 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                      {car.mainImageUrl ? (
                        <img 
                          src={car.mainImageUrl} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Car info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">
                        {car.name || `${car.brand?.name} ${car.model?.name} ${car.generation?.name || ''}`}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {car.engine?.maxPower && `${car.engine.maxPower} HP`}
                        {car.engine?.maxPower && car.chassis?.drive && ' • '}
                        {car.chassis?.drive}
                      </p>
                    </div>

                    {/* Add icon */}
                    <IoAddOutline className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSelector;
