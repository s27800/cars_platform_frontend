import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IoCarSportOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { getUserFuelReports } from '../../api/users';
import { Card, Spinner, Button, Badge, Pagination } from '../../components/ui';
import { formatDate, getConsumptionLevel } from '../../utils/helpers';


const UserFuelReportsList = () => {
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const { 
    data: reportsData, 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['userFuelReports', page, pageSize],
    queryFn: () => getUserFuelReports({ page, size: pageSize, sort: 'reportDate,desc' }),
    staleTime: 30000,
  });

  const reports = reportsData?.content || [];
  const totalPages = reportsData?.totalPages || 0;
  const totalElements = reportsData?.totalElements || 0;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400 mb-4">
          Failed to load your fuel reports. Please try again.
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Empty State
  if (reports.length === 0) {
    return (
      <div className="text-center py-8">
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
    );
  }

  return (
    <div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {totalElements} {totalElements === 1 ? 'report' : 'reports'} submitted
      </p>

      <div className="space-y-4">
        {reports.map((report) => (
          <UserFuelReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
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

        <Badge 
          variant={report.isApproved ? 'success' : 'warning'} 
          size="sm"
        >
          {report.isApproved ? 'Approved' : 'Pending'}
        </Badge>
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


export default UserFuelReportsList;
