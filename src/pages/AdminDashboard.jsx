import { Navigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  IoDocumentTextOutline, 
  IoSpeedometerOutline,
  IoCreateOutline,
  IoChevronForwardOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getPendingReviews, getPendingFuelReports } from '../api/admin';
import { getPendingProposals } from '../api/dataProposals';
import { Card, Spinner } from '../components/ui';


// Dashboard stat card component
const StatCard = ({ icon: Icon, title, count, description, linkTo, isLoading, error, colorClass }) => {
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
            Error loading data
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
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  // Fetch pending reviews count
  const { 
    data: pendingReviews, 
    isLoading: reviewsLoading, 
    error: reviewsError,
  } = useQuery({
    queryKey: ['adminPendingReviews'],
    queryFn: () => getPendingReviews({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Fetch pending fuel reports count
  const { 
    data: pendingFuelReports, 
    isLoading: fuelReportsLoading, 
    error: fuelReportsError,
  } = useQuery({
    queryKey: ['adminPendingFuelReports'],
    queryFn: () => getPendingFuelReports({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Fetch pending data proposals count
  const { 
    data: pendingProposals, 
    isLoading: proposalsLoading, 
    error: proposalsError,
  } = useQuery({
    queryKey: ['adminPendingProposals'],
    queryFn: () => getPendingProposals({ page: 0, size: 1 }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  // Redirect if not admin
  if (!isAdmin)
    return <Navigate to="/" replace />;

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
            Admin Dashboard
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage pending content and moderate user submissions
        </p>
      </div>

      {/* Summary Card */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              Pending Items Overview
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {totalPending === 0 
                ? 'All caught up! No items waiting for review.'
                : `You have ${totalPending} item${totalPending !== 1 ? 's' : ''} waiting for your review.`
              }
            </p>
          </div>
          {totalPending > 0 && (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                {totalPending} pending
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={IoDocumentTextOutline}
          title="Pending Reviews"
          count={reviewsCount}
          description="User reviews waiting for approval"
          linkTo="/admin/reviews"
          isLoading={reviewsLoading}
          error={reviewsError}
          colorClass="bg-blue-500"
        />

        <StatCard
          icon={IoSpeedometerOutline}
          title="Pending Fuel Reports"
          count={fuelReportsCount}
          description="Fuel consumption reports to verify"
          linkTo="/admin/fuel-reports"
          isLoading={fuelReportsLoading}
          error={fuelReportsError}
          colorClass="bg-emerald-500"
        />

        <StatCard
          icon={IoCreateOutline}
          title="Pending Data Proposals"
          count={proposalsCount}
          description="Car data change requests to review"
          linkTo="/admin/proposals"
          isLoading={proposalsLoading}
          error={proposalsError}
          colorClass="bg-violet-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
