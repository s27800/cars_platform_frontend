import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircle, IoDocumentTextOutline } from 'react-icons/io5';
import { createProposal } from '../../api/dataProposals';
import { getTags } from '../../api/tags';
import { Modal, Button, Select, TextArea, Input, Alert, Checkbox } from '../../components/ui';
import { PROPOSAL_CATEGORIES } from '../../utils/constants';


// Field definitions for each data category
const CATEGORY_FIELDS = {
  ENGINE: [
    { name: 'engineCode', labelKey: 'fields.engineCode', type: 'text' },
    { name: 'displacement', labelKey: 'fields.displacement', type: 'number' },
    { name: 'engineType', labelKey: 'fields.engineType', type: 'text' },
    { name: 'maxPower', labelKey: 'fields.maxPower', type: 'number' },
    { name: 'maxPowerRotationSpeed', labelKey: 'fields.maxPowerRpm', type: 'number' },
    { name: 'maxTorque', labelKey: 'fields.maxTorque', type: 'number' },
    { name: 'maxTorqueRotationSpeed', labelKey: 'fields.maxTorqueRpm', type: 'number' },
    { name: 'cylindersNumber', labelKey: 'fields.cylinders', type: 'number' },
    { name: 'valvesNumber', labelKey: 'fields.valves', type: 'number' },
    { name: 'turbo', labelKey: 'fields.turbo', type: 'text' },
  ],
  TRANSMISSION: [
    { name: 'transmissionType', labelKey: 'fields.transmissionType', type: 'text' },
    { name: 'transmissionName', labelKey: 'fields.transmissionName', type: 'text' },
    { name: 'gearsNumber', labelKey: 'fields.gears', type: 'number' },
    { name: 'clutchType', labelKey: 'fields.clutchType', type: 'text' },
  ],
  CHASSIS: [
    { name: 'drive', labelKey: 'fields.driveType', type: 'text' },
    { name: 'suspension', labelKey: 'fields.suspension', type: 'text' },
    { name: 'frontBrakes', labelKey: 'fields.frontBrakes', type: 'text' },
    { name: 'backBrakes', labelKey: 'fields.rearBrakes', type: 'text' },
    { name: 'frontBrakesRadius', labelKey: 'fields.frontBrakesRadius', type: 'number' },
    { name: 'backBrakesRadius', labelKey: 'fields.rearBrakesRadius', type: 'number' },
  ],
  PERFORMANCE: [
    { name: 'maxSpeed', labelKey: 'fields.maxSpeed', type: 'number' },
    { name: 'acceleration0100', labelKey: 'fields.acceleration', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionCity', labelKey: 'fields.cityConsumption', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionRoute', labelKey: 'fields.highwayConsumption', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionMixed', labelKey: 'fields.mixedConsumption', type: 'number', step: '0.1' },
    { name: 'fuelTankCapacity', labelKey: 'fields.fuelTank', type: 'number' },
  ],
  OUTSIDE_DIMENSIONS: [
    { name: 'length', labelKey: 'fields.length', type: 'number' },
    { name: 'width', labelKey: 'fields.width', type: 'number' },
    { name: 'height', labelKey: 'fields.height', type: 'number' },
    { name: 'wheelBase', labelKey: 'fields.wheelbase', type: 'number' },
    { name: 'clearance', labelKey: 'fields.groundClearance', type: 'number' },
  ],
  INSIDE_DIMENSIONS: [
    { name: 'minTrunkSpace', labelKey: 'fields.minTrunkSpace', type: 'number' },
    { name: 'maxTrunkSpace', labelKey: 'fields.maxTrunkSpace', type: 'number' },
    { name: 'heightFromSeatToRoofFront', labelKey: 'fields.frontHeadroom', type: 'number' },
    { name: 'heightFromSeatToRoofBack', labelKey: 'fields.rearHeadroom', type: 'number' },
  ],
  BASIC_INFO: [
    { name: 'doorsNumber', labelKey: 'fields.doors', type: 'number' },
    { name: 'seatsNumber', labelKey: 'fields.seats', type: 'number' },
    { name: 'productionYears', labelKey: 'fields.productionYears', type: 'text' },
    { name: 'description', labelKey: 'fields.description', type: 'text' },
  ],
  TAGS: [],
};


/**
 * Modal component for submitting data change proposals.
 */
const DataProposalModal = ({ isOpen, onClose, carId, carName, currentTags = [] }) => {
  const { t } = useTranslation('cars');
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tagChanges, setTagChanges] = useState({ addTagIds: [], removeTagIds: [] });
  const formikRef = useRef(null);

  // Fetch all available tags when TAGS category is selected
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Get current tag IDs for comparison
  const currentTagIds = useMemo(() => 
    new Set(currentTags?.map(tag => tag.id) || []),
    [currentTags]
  );

  const handleClose = useCallback(() => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    setSubmitSuccess(false);
    setTagChanges({ addTagIds: [], removeTagIds: [] });
    onClose();
  }, [onClose]);

  // Mutation for creating proposal
  const createMutation = useMutation({
    mutationFn: (proposalData) => createProposal(carId, proposalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProposals'] });
      setSubmitSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    },
  });

  // Validation schema with translations
  const proposalSchema = useMemo(() => Yup.object().shape({
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
    validationSchema: proposalSchema,
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

  const selectedFields = useMemo(() => 
    CATEGORY_FIELDS[formik.values.category] || [],
    [formik.values.category]
  );

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
            options={[
              { value: '', label: t('dataProposal.selectCategory') },
              { value: 'ENGINE', label: t('dataProposal.categories.engine') },
              { value: 'TRANSMISSION', label: t('dataProposal.categories.transmission') },
              { value: 'CHASSIS', label: t('dataProposal.categories.chassis') },
              { value: 'PERFORMANCE', label: t('dataProposal.categories.performance') },
              { value: 'OUTSIDE_DIMENSIONS', label: t('dataProposal.categories.outsideDimensions') },
              { value: 'INSIDE_DIMENSIONS', label: t('dataProposal.categories.insideDimensions') },
              { value: 'BASIC_INFO', label: t('dataProposal.categories.basicInfo') },
              { value: 'TAGS', label: t('dataProposal.categories.tags') },
            ]}
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
                    Current Tags (uncheck to remove):
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
                          {isMarkedForRemoval && <span className="text-red-500">✕</span>}
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
                    Add Tags:
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
                            {isMarkedForAdd && <span className="text-green-500">+</span>}
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
                  <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-1">Changes summary:</p>
                  {tagChanges.addTagIds.length > 0 && (
                    <p className="text-green-600 dark:text-green-400">
                      + Adding {tagChanges.addTagIds.length} tag(s)
                    </p>
                  )}
                  {tagChanges.removeTagIds.length > 0 && (
                    <p className="text-red-600 dark:text-red-400">
                      − Removing {tagChanges.removeTagIds.length} tag(s)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Comment field */}
          <TextArea
            label="Additional Notes (optional)"
            name="comment"
            placeholder="Explain why you're suggesting these changes. Include sources if available."
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              disabled={createMutation.isPending || !formik.values.category}
            >
              Submit Proposal
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
};

export default DataProposalModal;
