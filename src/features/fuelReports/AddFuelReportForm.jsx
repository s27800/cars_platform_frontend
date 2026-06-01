import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoCheckmarkCircle, IoSpeedometerOutline } from 'react-icons/io5';
import { createFuelReport } from '../../api/fuelReports';
import { Button, Input, TextArea, Alert } from '../../components/ui';


// Validation schema for the fuel report form
const fuelReportSchema = Yup.object().shape({
  fuelConsumption: Yup.number()
    .min(1, 'Fuel consumption must be at least 1 L/100km')
    .max(50, 'Fuel consumption cannot exceed 50 L/100km')
    .required('Fuel consumption is required'),
  comment: Yup.string()
    .max(500, 'Comment cannot exceed 500 characters'),
});


// Reusable form component for adding a new fuel report
const AddFuelReportForm = ({ carId, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mutation for creating new fuel report
  const createMutation = useMutation({
    mutationFn: (reportData) => createFuelReport(carId, reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelReports', carId] });
      queryClient.invalidateQueries({ queryKey: ['averageConsumption', carId] });
      setSubmitSuccess(true);
      formik.resetForm();
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    },
  });

  // Form setup
  const formik = useFormik({
    initialValues: {
      fuelConsumption: '',
      comment: '',
    },
    validationSchema: fuelReportSchema,
    onSubmit: (values) => {
      createMutation.mutate({
        fuelConsumption: parseFloat(values.fuelConsumption),
        comment: values.comment || null,
      });
    },
  });

  // Success message
  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <IoCheckmarkCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Report submitted successfully!
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your fuel report will be visible after moderation approval.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      
      {/* Error alert */}
      {createMutation.isError && (
        <Alert variant="error" title="Submission failed">
          {createMutation.error?.response?.data?.message || 'Failed to submit report. Please try again.'}
        </Alert>
      )}

      {/* Info box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          How to calculate your fuel consumption
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Fill your tank completely, reset your trip meter, and drive normally. 
          At the next fill-up, note the liters used and kilometers driven. 
          Calculate: (Liters × 100) ÷ Kilometers = L/100km
        </p>
      </div>

      {/* Fuel consumption input */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Fuel Consumption <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <IoSpeedometerOutline className="w-5 h-5" />
          </div>
          <Input
            type="number"
            name="fuelConsumption"
            placeholder="e.g., 7.5"
            step="0.1"
            min="1"
            max="50"
            value={formik.values.fuelConsumption}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fuelConsumption && formik.errors.fuelConsumption}
            className="pl-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
            L/100km
          </div>
        </div>
        {formik.touched.fuelConsumption && formik.errors.fuelConsumption && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.fuelConsumption}</p>
        )}
      </div>

      {/* Comment field */}
      <TextArea
        label="Additional Comments (optional)"
        name="comment"
        placeholder="Share details about your driving conditions: city/highway ratio, season, driving style, AC usage, etc."
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.comment && formik.errors.comment}
        maxLength={500}
        showCount
        rows={3}
      />

      {/* Submit buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          Submit Report
        </Button>
      </div>
    </form>
  );
};

export default AddFuelReportForm;
