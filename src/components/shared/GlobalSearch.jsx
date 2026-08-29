import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline, IoCloseOutline, IoCarSportOutline } from 'react-icons/io5';
import { searchCars } from '../../api/cars';
import { Input, Spinner } from '../../components/ui';
import { useDebounce } from '../../hooks';


/**
 * Global search component with autocomplete dropdown
 */
const GlobalSearch = ({ 
  className = '',
  placeholder,
  onSearchSubmit,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => searchCars({
      search: debouncedQuery,
      size: 6,
      page: 0,
    }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30000,
  });

  const results = useMemo(() => data?.content ?? [], [data]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when results change
  const [lastResults, setLastResults] = useState(results);

  if (lastResults !== results) {
    setLastResults(results);
    setHighlightedIndex(-1);
  }

  const handleSelect = useCallback((car) => {
    navigate(`/cars/${car.id}`);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  }, [navigate]);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      navigate(`/cars?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
      onSearchSubmit?.();
    }
  }, [query, navigate, onSearchSubmit]);

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const showResults = isOpen && debouncedQuery.length >= 2;
  const showLoading = isLoading || isFetching;

  const getCarDisplayName = (car) => {
    if (car.name) return car.name;
    return `${car.brand?.name || ''} ${car.model?.name || ''} ${car.generation?.name || ''}`.trim();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="w-full">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('navigation.search')}
          size={size}
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
          aria-label={t('navigation.search')}
          aria-expanded={showResults}
          aria-autocomplete="list"
          aria-controls="global-search-results"
          role="combobox"
        />
      </form>

      {/* Dropdown results */}
      {showResults && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden"
        >
          {showLoading && (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" />
            </div>
          )}

          {!showLoading && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <IoCarSportOutline className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('common:search.noResults', { defaultValue: 'No results found' })}
              </p>
              <button
                type="button"
                onClick={handleSearch}
                className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {t('common:search.searchAll', { defaultValue: 'Search for' })} "{debouncedQuery}"
              </button>
            </div>
          )}

          {!showLoading && results.length > 0 && (
            <>
              <ul className="max-h-80 overflow-y-auto" role="listbox">
                {results.map((car, index) => (
                  <li
                    key={car.id}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(car)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        highlightedIndex === index
                          ? 'bg-primary-50 dark:bg-primary-900/20'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                      }`}
                    >
                    
                      {/* Car thumbnail */}
                      <div className="w-14 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                        {car.mainImageUrl ? (
                          <img
                            src={car.mainImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IoCarSportOutline className="w-5 h-5 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Car info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 dark:text-white truncate">
                          {getCarDisplayName(car)}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                          {car.engine?.maxPower && `${car.engine.maxPower} HP`}
                          {car.engine?.maxPower && car.engine?.engineType && ' • '}
                          {car.engine?.engineType}
                          {(car.engine?.maxPower || car.engine?.engineType) && car.chassis?.drive && ' • '}
                          {car.chassis?.drive}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Search all link */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-3">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  {t('common:search.viewAll', { defaultValue: 'View all results for' })} "{query}"
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
