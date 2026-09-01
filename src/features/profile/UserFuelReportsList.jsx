import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoCarSportOutline, IoSpeedometerOutline, IoTrashOutline } from 'react-icons/io5';
import { getUserFuelReports } from './api';
import { deleteFuelReport } from '../fuelReports/api';
import { Card, Spinner, Button, Badge, Pagination, ConfirmModal, IconButton } from '../../shared/components/ui';
import { formatDate, getConsumptionLevel } from '../../shared/utils/helpers';
import { FUEL_REPORTS_PAGE_SIZE, STALE_TIME } from '../../shared/utils/constants';


// Fuel reports this user submitted with delete option
const UserFuelReportsList = () => {
  const { t } = useTranslation('profile');
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const pageSize = FUEL_REPORTS_PAGE_SIZE;
  const queryClient = useQueryClient();

  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', 'fuelReports', page, pageSize],
    queryFn: () => getUserFuelReports({ page, size: pageSize, sort: 'reportDate,desc' }),
    staleTime: STALE_TIME.SHORT,
  });

  const reports = reportsData?.content || [];
  const totalPages = reportsData?.totalPages || 0;
  const totalElements = reportsData?.totalElements || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFuelReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'fuelReports'] });
      setDeleteTarget(null);
    },
  });

  const handleDeleteClick = (report) => {
    setDeleteTarget(report);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget)
      deleteMutation.mutate(deleteTarget.id);
  };

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
          {t('common:errors.loadFailed')}
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          {t('common:retry')}
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
          {t('fuelReports.empty')}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {t('fuelReports.emptyDescription')}
        </p>
        <Button to="/cars" variant="primary">
          {t('common:browseCars')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        {t('cars:fuelReports.submitted', { count: totalElements })}
      </p>

      <div className="space-y-4">
        {reports.map((report) => (
          <UserFuelReportCard
            key={report.id}
            report={report}
            onDelete={() => handleDeleteClick(report)}
          />
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={t('cars:fuelReports.deleteReport')}
        message={t('cars:fuelReports.confirmDelete', { car: `${deleteTarget?.carInfo?.brandName} ${deleteTarget?.carInfo?.modelName}` })}
        confirmText={t('cars:fuelReports.deleteReport')}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};


// Card component for displaying user's fuel report with car info
const UserFuelReportCard = ({ report, onDelete }) => {
  const { t: tCars } = useTranslation('cars');
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
          {report.isApproved ? tCars('fuelReports.status.approved') : tCars('fuelReports.status.pending')}
        </Badge>
      </div>

      {/* Report Content */}
      <div className="p-4">

        {/* Fuel Consumption and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IoSpeedometerOutline className={`w-6 h-6 ${level.color}`} />
            <span className={`text-2xl font-bold ${level.color}`}>{fuelValue}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{tCars('fuelReports.unit')}</span>
            <Badge variant={level.variant} size="sm" className="ml-2">
              {tCars(`fuelReports.level.${level.labelKey}`)}
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

        {/* Delete button */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onDelete}
            label={tCars('fuelReports.deleteReport')}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <IoTrashOutline className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};


export default UserFuelReportsList;
