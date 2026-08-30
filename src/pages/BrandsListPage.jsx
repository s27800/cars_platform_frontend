import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  IoChevronBackOutline,
  IoSearchOutline,
  IoCarSportOutline,
  IoGlobeOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import { getBrands } from '../api/brands';
import { Spinner, Input } from '../components/ui';


const BrandsListPage = () => {
  const { t } = useTranslation('brands');
  const { t: tCommon } = useTranslation('common');
  const navigationType = useNavigationType();
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to top only on new navigation
  useEffect(() => {
    if (navigationType !== 'POP')
      window.scrollTo(0, 0);
  }, [navigationType]);

  // Fetch all brands
  const { data: brands, isLoading, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  // Filter and sort brands
  const filteredBrands = useMemo(() => {
    if (!brands)
        return [];

    let result = [...brands];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      result = result.filter(brand =>
        brand.name.toLowerCase().includes(query) ||
        brand.country?.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [brands, searchQuery]);

  // Get initials for placeholder logo
  const getInitials = (brandName) => {
    return brandName
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
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
          <IoCarSportOutline className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('errorTitle')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {t('errorDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-12">

      {/* Breadcrumb navigation */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
            >
              <IoChevronBackOutline className="w-4 h-4" />
              {tCommon('navigation.home')}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 dark:text-white font-medium">
              {t('breadcrumb')}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('subtitle', { count: brands?.length || 0 })}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Brands grid */}
        {filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <IoCarSportOutline className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('noBrands')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.id}`}
                className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Logo */}
                <div className="aspect-square flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-700/50">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="text-xl font-bold text-white">
                        {getInitials(brand.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Brand info */}
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {brand.name}
                  </h3>

                  <div className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {brand.country && (
                      <div className="flex items-center gap-1">
                        <IoGlobeOutline className="w-3.5 h-3.5" />
                        <span>{brand.country}</span>
                      </div>
                    )}
                    {brand.foundedYear && (
                      <div className="flex items-center gap-1">
                        <IoCalendarOutline className="w-3.5 h-3.5" />
                        <span>{t('foundedYear')} {brand.foundedYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsListPage;
