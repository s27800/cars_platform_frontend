import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  IoArrowBackOutline, 
  IoCarSportOutline,
  IoSpeedometerOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getUserFuelReports } from '../api/users';
import { Card, Spinner, Button, Badge, Pagination } from '../components/ui';
import { formatDate, getConsumptionLevel } from '../utils/helpers';


const UserReportsPage = () => {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const { 
    data: reportsData, 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['userFuelReports', page, pageSize],
    queryFn: () => getUserFuelReports({ page, size: pageSize, sort: 'reportDate,desc' }),
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  // Redirect not authenticated user
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: { pathname: '/profile/reports' } }} replace />;

  const reports = reportsData?.content || [];
  const totalPages = reportsData?.totalPages || 0;
  const totalElements = reportsData?.totalElements || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            to="/profile" 
            variant="ghost" 
            size="sm"
            leftIcon={<IoArrowBackOutline className="w-4 h-4" />}
          >
            Back to Profile
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
            <IoSpeedometerOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              My Fuel Reports
            </h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {totalElements} {totalElements === 1 ? 'report' : 'reports'} submitted
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card variant="bordered" padding="lg" className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">
            Failed to load your fuel reports. Please try again.
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && reports.length === 0 && (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="py-8">
            <IoSpeedometerOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No fuel reports yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              You haven't submitted any fuel consumption reports yet.
            </p>
            <Button to="/cars" variant="primary">
              Browse Cars
            </Button>
          </div>
        </Card>
      )}

      {/* Reports List */}
      {!isLoading && !error && reports.length > 0 && (
        <>
          <div className="space-y-4">
            {reports.map((report) => (
              <UserFuelReportCard key={report.id} report={report} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};


// Card component for displaying user's fuel report with car info
const UserFuelReportCard = ({ report }) => {
  const carInfo = report.carInfo;
  const fuelValue = parseFloat(report.fuelConsumption || 0).toFixed(1);
  const level = getConsumptionLevel(fuelValue);

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden">

      {/* Car Info Header */}
      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
        <Link 
          to={`/cars/${carInfo?.carId}`}
          className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg">
            <IoCarSportOutline className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {carInfo?.brandName} {carInfo?.modelName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {carInfo?.generationName}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">

          {/* Approval status badge */}
          <Badge 
            variant={report.isApproved ? 'success' : 'warning'} 
            size="sm"
          >
            {report.isApproved ? 'Approved' : 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-4">

        {/* Fuel Consumption and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IoSpeedometerOutline className={`w-6 h-6 ${level.color}`} />
            <span className={`text-2xl font-bold ${level.color}`}>{fuelValue}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">L/100km</span>
            <Badge variant={level.variant} size="sm" className="ml-2">
              {level.label}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(report.reportDate)}
          </p>
        </div>

        {/* Comment */}
        {report.comment && (
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
            {report.comment}
          </p>
        )}
      </div>
    </Card>
  );
};


export default UserReportsPage;
