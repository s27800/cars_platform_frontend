import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  IoDocumentTextOutline,
  IoSpeedometerOutline,
  IoCreateOutline,
  IoChevronForwardOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useAuth } from '../../shared/hooks';
import { getPendingReviews, getPendingFuelReports } from './api';
import { getPendingProposals } from '../dataProposals/api';
import { Card, Spinner } from '../../shared/components/ui';
import { STALE_TIME } from '../../shared/utils/constants';


// Dashboard stat card component
const StatCard = ({ icon: Icon, title, count, description, linkTo, isLoading, error, colorClass, errorText }) => {
  const cardContent = (
    <Card
      variant="bordered"
      padding="md"
      hoverable={!!linkTo}
      className="flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {linkTo && (
          <IoChevronForwardOutline className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
          {title}
        </h3>

        {isLoading ? (
          <div className="flex items-center h-9">
            <Spinner size="sm" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 dark:text-red-400">
            {errorText}
          </p>
        ) : (
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">
            {count}
          </p>
        )}
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
        {description}
      </p>
    </Card>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};


const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { t } = useTranslation('admin');

  // Fetch pending reviews count
  const {
    data: pendingReviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ['admin', 'pendingReviews'],
    queryFn: () => getPendingReviews({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: STALE_TIME.SHORT,
  });

  // Fetch pending fuel reports count
  const {
    data: pendingFuelReports,
    isLoading: fuelReportsLoading,
    error: fuelReportsError,
  } = useQuery({
    queryKey: ['admin', 'pendingFuelReports'],
    queryFn: () => getPendingFuelReports({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: STALE_TIME.SHORT,
  });

  // Fetch pending data proposals count
  const {
    data: pendingProposals,
    isLoading: proposalsLoading,
    error: proposalsError,
  } = useQuery({
    queryKey: ['admin', 'pendingProposals'],
    queryFn: () => getPendingProposals({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: STALE_TIME.SHORT,
  });

  // Extract counts from paginated responses
  const reviewsCount = pendingReviews?.totalElements ?? 0;
  const fuelReportsCount = pendingFuelReports?.totalElements ?? 0;
  const proposalsCount = pendingProposals?.totalElements ?? 0;

  const totalPending = reviewsCount + fuelReportsCount + proposalsCount;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <IoShieldCheckmarkOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Summary Card */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              {t('dashboard.overview.title')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {totalPending === 0
                ? t('dashboard.overview.allCaughtUp')
                : t('dashboard.overview.pendingMessage', { count: totalPending })
              }
            </p>
          </div>
          {totalPending > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                {t('dashboard.overview.pending', { count: totalPending })}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={IoDocumentTextOutline}
          title={t('dashboard.stats.pendingReviews')}
          count={reviewsCount}
          description={t('dashboard.stats.pendingReviewsDesc')}
          linkTo="/admin/reviews"
          isLoading={reviewsLoading}
          error={reviewsError}
          errorText={t('common.error')}
          colorClass="bg-blue-500"
        />

        <StatCard
          icon={IoSpeedometerOutline}
          title={t('dashboard.stats.pendingFuelReports')}
          count={fuelReportsCount}
          description={t('dashboard.stats.pendingFuelReportsDesc')}
          linkTo="/admin/fuel-reports"
          isLoading={fuelReportsLoading}
          error={fuelReportsError}
          errorText={t('common.error')}
          colorClass="bg-emerald-500"
        />

        <StatCard
          icon={IoCreateOutline}
          title={t('dashboard.stats.pendingDataProposals')}
          count={proposalsCount}
          description={t('dashboard.stats.pendingDataProposalsDesc')}
          linkTo="/admin/proposals"
          isLoading={proposalsLoading}
          error={proposalsError}
          errorText={t('common.error')}
          colorClass="bg-violet-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
