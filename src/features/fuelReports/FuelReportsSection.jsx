import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IoAddOutline, IoFlameOutline, IoSpeedometerOutline, IoChevronDownOutline } from 'react-icons/io5';
import { getFuelReports, getAverageConsumption } from './api';
import { useAuth } from '../../shared/hooks';
import { Button, Spinner, Pagination, Modal, Alert } from '../../shared/components/ui';
import FuelReportCard from './FuelReportCard';
import AddFuelReportForm from './AddFuelReportForm';
import { FUEL_REPORTS_PAGE_SIZE } from '../../shared/utils/constants';


// Reusable section component for displaying fuel reports and average consumption
const FuelReportsSection = ({ carId, defaultOpen = true, className = '' }) => {
  const { t } = useTranslation('cars');
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const pageSize = FUEL_REPORTS_PAGE_SIZE;

  // Fetch fuel reports with pagination
  const {
    data: reportsData,
    isLoading: isLoadingReports,
    isError: isReportsError,
  } = useQuery({
    queryKey: ['fuelReports', 'list', carId, page, pageSize],
    queryFn: () => getFuelReports(carId, { page, size: pageSize }),
    enabled: !!carId,
  });

  // Fetch average consumption
  const {
    data: averageConsumption,
    isLoading: isLoadingAverage,
  } = useQuery({
    queryKey: ['fuelReports', 'averageConsumption', carId],
    queryFn: () => getAverageConsumption(carId),
    enabled: !!carId,
  });

  const reports = reportsData?.content || [];
  const totalElements = reportsData?.totalElements || 0;
  const totalPages = reportsData?.totalPages || 0;

  const handleReportSuccess = () => {
    setShowAddForm(false);
    setPage(0);
  };

  const formatConsumption = (value) => {
    if (value === null || value === undefined)
      return null;

    return typeof value === 'number' ? value.toFixed(1) : parseFloat(value).toFixed(1);
  };

  const avgValue = formatConsumption(averageConsumption?.averageFuelConsumption);

  return (
    <div className={`border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden ${className}`}>

      {/* Section header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <IoFlameOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {t('details.fuelReports')}
          </h2>
          {totalElements > 0 && (
            <span className="text-sm text-neutral-500">
              ({t('fuelReports.submitted', { count: totalElements })})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddForm(true);
              }}
              leftIcon={<IoAddOutline className="w-4 h-4" />}
            >
              {t('details.addFuelReport')}
            </Button>
          )}
          <IoChevronDownOutline
            className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Collapsible content */}
      {isOpen && (
      <div className="p-4 bg-white dark:bg-neutral-800">

      {/* Average consumption card */}
      {isLoadingAverage ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : avgValue ? (
        <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                {t('stats.fuelConsumption')}
              </h4>
              <p className="text-sm text-neutral-500">
                {t('fuelReports.basedOnReports', { count: totalElements })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <IoSpeedometerOutline className="w-8 h-8 text-primary-500" />
              <div className="text-right">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {avgValue}
                </span>
                <span className="text-lg text-neutral-500 dark:text-neutral-400 ml-1">
                  {t('fuelReports.unit')}
                </span>
              </div>
            </div>
          </div>

          {/* Comparison with manufacturer data */}
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t('fuelReports.disclaimer')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 mb-6 text-center">
          <IoSpeedometerOutline className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">
            {t('details.noFuelReports')}
          </p>
        </div>
      )}

      {/* Reports list */}
      {isLoadingReports ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isReportsError ? (
        <Alert variant="error" title={t('common:errors.somethingWentWrong')}>
          {t('common:errors.tryAgain')}
        </Alert>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
          <IoFlameOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            {t('details.noFuelReports')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('details.noFuelReportsDescription')}
          </p>
          {isAuthenticated ? (
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              leftIcon={<IoAddOutline className="w-4 h-4" />}
            >
              {t('details.addFuelReport')}
            </Button>
          ) : (
            <p className="text-sm text-neutral-500">
              <Button to="/login" variant="ghost" size="sm">
                {t('auth:login')}
              </Button>
              {t('fuelReports.loginRequired')}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <FuelReportCard
              key={report.id}
              report={report}
              carId={carId}
            />
          ))}

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
      )}
      </div>
      )}

      {/* Add fuel report modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title={t('details.addFuelReport')}
        size="md"
      >
        <AddFuelReportForm
          carId={carId}
          onSuccess={handleReportSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </Modal>
    </div>
  );
};

export default FuelReportsSection;
