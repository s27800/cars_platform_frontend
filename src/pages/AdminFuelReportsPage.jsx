import { useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  IoArrowBackOutline,
  IoCarSportOutline,
  IoSpeedometerOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoHeartOutline,
  IoWaterOutline,
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { getPendingFuelReports, approveFuelReport } from '../api/admin';
import { Card, Spinner, Button, Badge, Pagination } from '../components/ui';
import { formatDate } from '../utils/helpers';


// Fuel report card component for admin view
const FuelReportCard = ({ report, onApprove, onReject, isResolving }) => {
  const carInfo = report.carInfo;

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-600">

      {/* Header with car info */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-800/80 dark:to-neutral-800/40 border-b border-neutral-200 dark:border-neutral-700">
        <Link
          to={`/cars/${carInfo?.carId}`}
          className="flex items-center gap-4 group"
        >
          <div className="p-2.5 bg-white dark:bg-neutral-700 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
            <IoCarSportOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-lg text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {carInfo?.brandName} {carInfo?.modelName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {carInfo?.generationName}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">

          {/* Fuel consumption */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-700 rounded-lg shadow-sm">
            <IoWaterOutline className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-neutral-900 dark:text-white">{report.fuelConsumption}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">L/100km</span>
          </div>
          
          <Badge variant="warning" size="md" className="shadow-sm">
            <IoTimeOutline className="w-4 h-4 mr-1.5" />
            Pending
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoPersonOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="font-medium">{report.usernameResponse?.username || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoCalendarOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span>{formatDate(report.reportDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <IoHeartOutline className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span>{report.likesCount || 0} likes</span>
          </div>
        </div>

        {/* Fuel consumption highlight */}
        <div className="mb-5 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white dark:bg-emerald-900/40 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <IoSpeedometerOutline className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Reported fuel consumption</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
                {report.fuelConsumption} <span className="text-base font-normal">L/100km</span>
              </p>
            </div>
          </div>
        </div>

        {/* User comment */}
        {report.comment && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              User's comment:
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-100 dark:border-neutral-600/50 leading-relaxed">
              {report.comment}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(report.id)}
            disabled={isResolving}
            loading={isResolving}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 border border-transparent hover:border-green-200 dark:hover:border-green-800 disabled:text-green-400 disabled:opacity-60"
          >
            <IoCheckmarkCircleOutline className="w-4 h-4" />
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onReject(report.id)}
            disabled={isResolving}
            className="flex items-center gap-2"
          >
            <IoCloseCircleOutline className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};


const AdminFuelReportsPage = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Fetch pending fuel reports
  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminPendingFuelReports', page, pageSize],
    queryFn: () => getPendingFuelReports({ page, size: pageSize, sort: 'reportDate,desc' }),
    enabled: isAuthenticated && isAdmin,
    staleTime: 30 * 1000,
  });

  // Resolve fuel report mutation
  const resolveMutation = useMutation({
    mutationFn: ({ id, approve }) => approveFuelReport(id, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingFuelReports'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: (error) => {
      console.error('Failed to resolve fuel report:', error);
      alert(error?.response?.data?.message || 'Failed to resolve fuel report. Please try again.');
    },
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

  const reports = reportsData?.content || [];
  const totalPages = reportsData?.totalPages || 0;
  const totalElements = reportsData?.totalElements || 0;

  const handleApprove = (reportId) => {
    resolveMutation.mutate({ id: reportId, approve: true });
  };

  const handleReject = (reportId) => {
    resolveMutation.mutate({ id: reportId, approve: false });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 group"
        >
          <IoArrowBackOutline className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/10">
            <IoSpeedometerOutline className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
              Fuel Report Moderation
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Review and verify user-submitted fuel consumption reports
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Loading fuel reports...</p>
        </div>
      ) : error ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <IoCloseCircleOutline className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
            Failed to load fuel reports. Please try again.
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      ) : reports.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <IoCheckmarkCircleOutline className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            All caught up!
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            There are no pending fuel reports to verify. Check back later.
          </p>
        </Card>
      ) : (
        <>
        
          {/* Stats */}
          <div className="mb-6 px-4 py-3 bg-neutral-100/80 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <span className="text-lg font-bold text-neutral-900 dark:text-white">{totalElements}</span>
              {' '}fuel report{totalElements !== 1 ? 's' : ''} pending verification
            </p>
          </div>

          {/* Reports list */}
          <div className="space-y-5">
            {reports.map((report) => (
              <FuelReportCard
                key={report.id}
                report={report}
                onApprove={handleApprove}
                onReject={handleReject}
                isResolving={resolveMutation.isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminFuelReportsPage;
