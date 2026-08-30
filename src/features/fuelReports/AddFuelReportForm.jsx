import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircle, IoSpeedometerOutline } from 'react-icons/io5';
import { createFuelReport } from '../../api/fuelReports';
import { Button, Input, TextArea, Alert } from '../../components/ui';


// Reusable form component for adding a new fuel report
const AddFuelReportForm = ({ carId, onSuccess, onCancel }) => {
  const { t } = useTranslation('cars');
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation schema for the fuel report form
  const fuelReportSchema = Yup.object().shape({
    fuelConsumption: Yup.number()
      .min(1, t('validation:minValue', { min: 1 }))
      .max(50, t('validation:maxValue', { max: 50 }))
      .required(t('validation:required')),
    comment: Yup.string()
      .max(500, t('validation:maxLength', { max: 500 })),
  });

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
          {t('fuelReports.submitSuccess', 'Report submitted successfully!')}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('fuelReports.pendingApproval', 'Your fuel report will be visible after moderation approval.')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      
      {/* Error alert */}
      {createMutation.isError && (
        <Alert variant="error" title={t('common:errors.somethingWentWrong')}>
          {createMutation.error?.response?.data?.message || t('common:errors.tryAgain')}
        </Alert>
      )}

      {/* Info box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          {t('fuelReports.howToCalculate', 'How to calculate your fuel consumption')}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('fuelReports.howToCalculateDesc', 'Fill your tank completely, reset your trip meter, and drive normally. At the next fill-up, note the liters used and kilometers driven. Calculate: (Liters × 100) ÷ Kilometers = L/100km')}
        </p>
      </div>

      {/* Fuel consumption input */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {t('fuelReports.fuelConsumption', 'Fuel Consumption')} <span className="text-red-500">*</span>
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
            {t('fuelReports.unit')}
          </div>
        </div>
        {formik.touched.fuelConsumption && formik.errors.fuelConsumption && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.fuelConsumption}</p>
        )}
      </div>

      {/* Comment field */}
      <TextArea
        label={t('fuelReports.additionalComments', 'Additional Comments (optional)')}
        name="comment"
        placeholder={t('fuelReports.commentPlaceholder', 'Share details about your driving conditions: city/highway ratio, season, driving style, AC usage, etc.')}
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
            {t('common:buttons.cancel')}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          {t('fuelReports.submitReport', 'Submit Report')}
        </Button>
      </div>
    </form>
  );
};

export default AddFuelReportForm;
