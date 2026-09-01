import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoAddOutline, IoCheckmarkCircle, IoCloseOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { createProposal } from './api';
import { getTags } from '../../shared/api/tags';
import { Modal, Button, Select, TextArea, Input, Alert } from '../../shared/components/ui';
import { PROPOSAL_CATEGORIES, CATEGORY_FIELDS } from './categories';
import { STALE_TIME } from '../../shared/utils/constants';


const SUCCESS_CLOSE_DELAY_MS = 2500;


/**
 * Modal for proposing a correction to a car's technical data.
 *
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Called when the user dismisses the modal
 * @param {string} props.carId - Car the proposal applies to
 * @param {string} props.carName - Car name shown in the intro text
 * @param {Array} props.currentTags - Tags already assigned to the car
 */
const DataProposalModal = ({ isOpen, onClose, carId, carName, currentTags = [] }) => {
  const { t } = useTranslation('cars');
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tagChanges, setTagChanges] = useState({ addTagIds: [], removeTagIds: [] });
  const formikRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Fetch all available tags when TAGS category is selected
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: isOpen,
    staleTime: STALE_TIME.LONG,
  });

  // Get current tag IDs for comparison
  const currentTagIds = useMemo(() =>
    new Set(currentTags?.map(tag => tag.id) || []),
    [currentTags]
  );

  const handleClose = useCallback(() => {
    if (formikRef.current)
      formikRef.current.resetForm();
    setSubmitSuccess(false);
    setTagChanges({ addTagIds: [], removeTagIds: [] });
    onClose();
  }, [onClose]);

  // Mutation for creating proposal
  const createMutation = useMutation({
    mutationFn: (proposalData) => createProposal(carId, proposalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'proposals'] });
      setSubmitSuccess(true);
      closeTimerRef.current = setTimeout(handleClose, SUCCESS_CLOSE_DELAY_MS);
    },
  });

  // Validation schema with translations
  const validationSchema = useMemo(() => Yup.object().shape({
    category: Yup.string().required(t('dataProposal.validation.categoryRequired')),
    comment: Yup.string().max(1000, t('dataProposal.validation.commentMaxLength')),
  }), [t]);

  // Form setup
  const formik = useFormik({
    initialValues: {
      category: '',
      comment: '',
      proposedValues: {},
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {

      // Handle TAGS category separately
      if (values.category === 'TAGS') {
        const hasChanges = tagChanges.addTagIds.length > 0 || tagChanges.removeTagIds.length > 0;

        if (!hasChanges) {
          formik.setFieldError('category', t('dataProposal.validation.selectTag'));
          return;
        }

        const proposedValues = {};
        
        if (tagChanges.addTagIds.length > 0)
          proposedValues.addTagIds = tagChanges.addTagIds;

        if (tagChanges.removeTagIds.length > 0)
          proposedValues.removeTagIds = tagChanges.removeTagIds;

        createMutation.mutate({
          category: values.category,
          comment: values.comment || null,
          proposedValues,
        });

        return;
      }

      // Filter out empty values from proposed changes
      const filteredValues = Object.entries(values.proposedValues)
        .filter(([, value]) => value !== '' && value !== null && value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      if (Object.keys(filteredValues).length === 0) {
        formik.setFieldError('category', t('dataProposal.validation.fillAtLeastOneField'));
        return;
      }

      createMutation.mutate({
        category: values.category,
        comment: values.comment || null,
        proposedValues: filteredValues,
      });
    },
  });

  useEffect(() => {
    formikRef.current = formik;
  });

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const selectedFields = useMemo(() =>
    CATEGORY_FIELDS[formik.values.category] || [],
    [formik.values.category]
  );

  const categoryOptions = useMemo(() => [
    { value: '', label: t('dataProposal.selectCategory') },
    ...PROPOSAL_CATEGORIES.map(({ value, labelKey }) => ({
      value,
      label: t(`dataProposal.categories.${labelKey}`),
    })),
  ], [t]);

  // Handle tag checkbox change
  const handleTagChange = useCallback((tagId, isCurrentlyOnCar) => {
    setTagChanges(prev => {
      const newChanges = { ...prev };

      if (isCurrentlyOnCar) {

        // Tag is on car - toggle remove
        if (prev.removeTagIds.includes(tagId))
          newChanges.removeTagIds = prev.removeTagIds.filter(id => id !== tagId);
        else
          newChanges.removeTagIds = [...prev.removeTagIds, tagId];

      } else {

        // Tag is not on car - toggle add
        if (prev.addTagIds.includes(tagId))
          newChanges.addTagIds = prev.addTagIds.filter(id => id !== tagId);
        else
          newChanges.addTagIds = [...prev.addTagIds, tagId];
      }

      return newChanges;
    });
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((e) => {
    formik.setFieldValue('category', e.target.value);
    formik.setFieldValue('proposedValues', {});
    setTagChanges({ addTagIds: [], removeTagIds: [] });
  }, [formik]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('dataProposal.title')}
      size="lg"
    >
      {submitSuccess ? (
        <div className="text-center py-8">
          <IoCheckmarkCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            {t('dataProposal.success.title')}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('dataProposal.success.description')}
          </p>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* Error alert */}
          {createMutation.isError && (
            <Alert variant="error" title={t('dataProposal.error.title')}>
              {createMutation.error?.response?.data?.message || t('dataProposal.error.description')}
            </Alert>
          )}

          {/* Info box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <IoDocumentTextOutline className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('dataProposal.info.suggesting', { carName })}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                {t('dataProposal.info.instructions')}
              </p>
            </div>
          </div>

          {/* Category select */}
          <Select
            label={t('dataProposal.category')}
            name="category"
            options={categoryOptions}
            value={formik.values.category}
            onChange={handleCategoryChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && formik.errors.category}
          />

          {/* Dynamic fields based on selected category */}
          {selectedFields.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('dataProposal.proposedValues')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedFields.map(field => {
                  const label = t(`dataProposal.${field.labelKey}`);
                  return (
                    <Input
                      key={field.name}
                      label={label}
                      type={field.type}
                      step={field.step}
                      name={`proposedValues.${field.name}`}
                      value={formik.values.proposedValues[field.name] || ''}
                      onChange={formik.handleChange}
                      placeholder={t('dataProposal.enterNew', { field: label.toLowerCase() })}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Tag selection for TAGS category */}
          {formik.values.category === 'TAGS' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('dataProposal.tags.title')}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('dataProposal.tags.instructions')}
              </p>

              {/* Current tags section */}
              {currentTags?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {t('dataProposal.tags.current')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentTags.map(tag => {
                      const isMarkedForRemoval = tagChanges.removeTagIds.includes(tag.id);
                      return (
                        <label
                          key={tag.id}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer
                            border transition-colors
                            ${isMarkedForRemoval
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 line-through'
                              : 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={!isMarkedForRemoval}
                            onChange={() => handleTagChange(tag.id, true)}
                            className="sr-only"
                          />
                          {tag.name}
                          {isMarkedForRemoval && <IoCloseOutline className="w-4 h-4 text-red-500" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available tags section */}
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {t('dataProposal.tags.add')}
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {availableTags
                      .filter(tag => !currentTagIds.has(tag.id))
                      .map(tag => {
                        const isMarkedForAdd = tagChanges.addTagIds.includes(tag.id);
                        return (
                          <label
                            key={tag.id}
                            className={`
                              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer
                              border transition-colors
                              ${isMarkedForAdd
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                                : 'bg-neutral-100 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={isMarkedForAdd}
                              onChange={() => handleTagChange(tag.id, false)}
                              className="sr-only"
                            />
                            {isMarkedForAdd && <IoAddOutline className="w-4 h-4 text-green-500" />}
                            {tag.name}
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Summary of changes */}
              {(tagChanges.addTagIds.length > 0 || tagChanges.removeTagIds.length > 0) && (
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm">
                  <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('dataProposal.tags.summary')}
                  </p>
                  {tagChanges.addTagIds.length > 0 && (
                    <p className="text-green-600 dark:text-green-400">
                      {t('dataProposal.tags.adding', { count: tagChanges.addTagIds.length })}
                    </p>
                  )}
                  {tagChanges.removeTagIds.length > 0 && (
                    <p className="text-red-600 dark:text-red-400">
                      {t('dataProposal.tags.removing', { count: tagChanges.removeTagIds.length })}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Comment field */}
          <TextArea
            label={t('dataProposal.comment')}
            name="comment"
            placeholder={t('dataProposal.commentPlaceholder')}
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.comment && formik.errors.comment}
            maxLength={1000}
            showCount
            rows={3}
          />

          {/* Footer buttons */}
          <Modal.Footer>
            <Button type="button" variant="ghost" onClick={handleClose}>
              {t('common:buttons.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              disabled={createMutation.isPending || !formik.values.category}
            >
              {t('dataProposal.submit')}
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
};

export default DataProposalModal;
