import { useEffect } from 'react';
import { useParams, Link, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  IoChevronBackOutline,
  IoGlobeOutline,
  IoCalendarOutline,
  IoCarSportOutline,
  IoGridOutline,
} from 'react-icons/io5';
import { getBrandById } from '../api/brands';
import { Button, Spinner, Badge } from '../components/ui';
import { ModelsGrid } from '../features/brands';


const BrandDetailsPage = () => {
  const { t } = useTranslation('brands');
  const { t: tCommon } = useTranslation('common');
  const { id } = useParams();
  const navigationType = useNavigationType();

  // Scroll to top only on new navigation (not on back/forward)
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [id, navigationType]);

  const { data: brand, isLoading, isError, error } = useQuery({
    queryKey: ['brand', id],
    queryFn: () => getBrandById(id),
    enabled: !!id,
  });

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
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">{t('errorTitle')}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error?.response?.status === 404
              ? t('errorNotFound')
              : t('errorDescription')
            }
          </p>
          <Button to="/" variant="primary">{tCommon('buttons.home')}</Button>
        </div>
      </div>
    );
  }

  const {
    name,
    country,
    foundedYear,
    description,
    logoUrl,
    models = [],
  } = brand;

  // Get initials for placeholder
  const getInitials = (brandName) => {
    return brandName
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

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
            <Link
              to="/brands"
              className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {t('breadcrumb')}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-900 dark:text-white font-medium truncate">
              {name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Brand header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Logo / Placeholder */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${name} logo`}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-xl bg-neutral-100 dark:bg-neutral-700 p-2"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {getInitials(name)}
                  </span>
                </div>
              )}
            </div>

            {/* Brand info */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {country && (
                  <Badge variant="default" size="md">
                    <IoGlobeOutline className="w-3.5 h-3.5 mr-1" />
                    {country}
                  </Badge>
                )}
                {foundedYear && (
                  <Badge variant="default" size="md">
                    <IoCalendarOutline className="w-3.5 h-3.5 mr-1" />
                    {t('foundedYear')} {foundedYear}
                  </Badge>
                )}
                <Badge variant="primary" size="md">
                  <IoGridOutline className="w-3.5 h-3.5 mr-1" />
                  {t('modelsCount', { count: models.length })}
                </Badge>
              </div>

              {description && (
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <Button
                to={`/cars?brandIds=${id}`}
                variant="primary"
                leftIcon={<IoCarSportOutline className="w-4 h-4" />}
              >
                {t('viewAllCars')}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat
            icon={<IoGridOutline className="w-5 h-5" />}
            label={t('stats.models')}
            value={models.length}
          />
          <QuickStat
            icon={<IoGlobeOutline className="w-5 h-5" />}
            label={t('stats.country')}
            value={country || t('stats.notAvailable')}
          />
          <QuickStat
            icon={<IoCalendarOutline className="w-5 h-5" />}
            label={t('stats.founded')}
            value={foundedYear || t('stats.notAvailable')}
          />
          <QuickStat
            icon={<IoCarSportOutline className="w-5 h-5" />}
            label={t('stats.generations')}
            value={models.reduce((acc, m) => acc + (m.generationsCount || 0), 0) || '—'}
          />
        </div>

        {/* Models section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {t('modelsSection.title')}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                {t('modelsSection.subtitle')}
              </p>
            </div>
          </div>

          {models.length > 0 ? (
            <ModelsGrid
              models={models}
            />
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <IoCarSportOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400">
                {t('modelsSection.empty')}
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


export default BrandDetailsPage;
