import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircle, IoStar } from 'react-icons/io5';
import { createReview } from '../../api/reviews';
import { Button, TextArea, Rating, Alert } from '../../components/ui';
import { RATING_CATEGORIES } from '../../utils/constants';


// Reusable form component for adding car reviews with ratings
const AddReviewForm = ({ carId, onSuccess, onCancel }) => {
  const { t } = useTranslation('reviews');
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Build validation schema dynamically from categories
  const ratingRule = Yup.number().min(1, t('validation:required')).max(5).required(t('validation:required'));
  const reviewSchema = Yup.object().shape({
    comment: Yup.string()
      .min(10, t('validation:minLength', { min: 10 }))
      .max(2000, t('validation:maxLength', { max: 2000 }))
      .required(t('validation:required')),
    ...Object.fromEntries(RATING_CATEGORIES.map(cat => [cat.key, ratingRule])),
  });

  const createMutation = useMutation({
    mutationFn: (reviewData) => createReview(carId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', carId] });
      queryClient.invalidateQueries({ queryKey: ['averageRatings', carId] });
      setSubmitSuccess(true);
      formik.resetForm();
      setTimeout(() => onSuccess?.(), 2000);
    },
  });

  const formik = useFormik({
    initialValues: {
      comment: '',
      engineRating: 0,
      transmissionRating: 0,
      steeringRating: 0,
      suspensionRating: 0,
      visibilityRating: 0,
      ergonomicsRating: 0,
      soundProofingRating: 0,
      interiorSpaceRating: 0,
      maintenanceRating: 0,
      priceQualityRating: 0,
      failureFreeRating: 0,
    },
    validationSchema: reviewSchema,
    onSubmit: (values) => {
      createMutation.mutate(values);
    },
  });

  // Success message
  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <IoCheckmarkCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          {t('messages.submitSuccess')}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t('messages.pendingApproval', 'Your review will be visible after moderation approval.')}
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

      {/* Comment field */}
      <TextArea
        label={t('form.content')}
        name="comment"
        placeholder={t('form.contentPlaceholder')}
        value={formik.values.comment}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.comment && formik.errors.comment}
        maxLength={2000}
        showCount
        rows={5}
      />

      {/* Ratings section */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
          <IoStar className="w-4 h-4 text-yellow-400" />
          {t('form.rateAspects', 'Rate different aspects (1-5 stars)')}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RATING_CATEGORIES.map(({ key, labelKey, descKey }) => (
            <div
              key={key}
              className={`
                p-3 rounded-lg border transition-colors
                ${formik.touched[key] && formik.errors[key]
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                  : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50'
                }
              `}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                    {t(`ratings.${labelKey}`)}
                  </label>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t(`ratings.${descKey}`)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <Rating
                  value={formik.values[key]}
                  onChange={(value) => formik.setFieldValue(key, value)}
                  size="md"
                  precision={1}
                />
              </div>
              
              {formik.touched[key] && formik.errors[key] && (
                <p className="mt-1 text-xs text-red-500">{formik.errors[key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('form.cancel')}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          {t('form.submit')}
        </Button>
      </div>
    </form>
  );
};

export default AddReviewForm;
