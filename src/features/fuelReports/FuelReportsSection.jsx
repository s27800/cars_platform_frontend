import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoAddOutline, IoFlameOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { getFuelReports, getAverageConsumption } from '../../api/fuelReports';
import { useAuth } from '../../hooks';
import { Button, Spinner, Pagination, Modal, Alert } from '../../components/ui';
import FuelReportCard from './FuelReportCard';
import AddFuelReportForm from './AddFuelReportForm';


// Reusable section component for displaying fuel reports and average consumption
const FuelReportsSection = ({ carId, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const pageSize = 5;

  // Fetch fuel reports with pagination
  const { 
    data: reportsData, 
    isLoading: isLoadingReports,
    isError: isReportsError,
  } = useQuery({
    queryKey: ['fuelReports', carId, page, pageSize],
    queryFn: () => getFuelReports(carId, { page, size: pageSize }),
    enabled: !!carId,
  });

  // Fetch average consumption
  const { 
    data: averageConsumption,
    isLoading: isLoadingAverage,
  } = useQuery({
    queryKey: ['averageConsumption', carId],
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

  const avgValue = formatConsumption(averageConsumption);

  return (
    <div className={className}>

      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IoFlameOutline className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Fuel Reports
          </h2>
          {totalElements > 0 && (
            <span className="text-sm text-neutral-500">
              ({totalElements} {totalElements === 1 ? 'report' : 'reports'})
            </span>
          )}
        </div>

        {isAuthenticated && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
            leftIcon={<IoAddOutline className="w-4 h-4" />}
          >
            Add Report
          </Button>
        )}
      </div>

      {/* Average consumption card */}
      {isLoadingAverage ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : avgValue ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Average Real-World Consumption
              </h4>
              <p className="text-sm text-neutral-500">
                Based on {totalElements} user {totalElements === 1 ? 'report' : 'reports'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <IoSpeedometerOutline className="w-8 h-8 text-primary-500" />
              <div className="text-right">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {avgValue}
                </span>
                <span className="text-lg text-neutral-500 dark:text-neutral-400 ml-1">
                  L/100km
                </span>
              </div>
            </div>
          </div>

          {/* Comparison with manufacturer data */}
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Real-world fuel consumption may differ from manufacturer specifications 
              based on driving conditions, style, and maintenance.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 mb-6 text-center">
          <IoSpeedometerOutline className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">
            No consumption data available yet
          </p>
        </div>
      )}

      {/* Reports list */}
      {isLoadingReports ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : isReportsError ? (
        <Alert variant="error" title="Failed to load reports">
          Something went wrong while loading fuel reports. Please try refreshing the page.
        </Alert>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
          <IoFlameOutline className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            No fuel reports yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Help others by sharing your real fuel consumption data!
          </p>
          {isAuthenticated ? (
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              leftIcon={<IoAddOutline className="w-4 h-4" />}
            >
              Add Fuel Report
            </Button>
          ) : (
            <p className="text-sm text-neutral-500">
              <Button to="/login" variant="ghost" size="sm">
                Login
              </Button>
              to add a report
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

      {/* Add fuel report modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add Fuel Report"
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
