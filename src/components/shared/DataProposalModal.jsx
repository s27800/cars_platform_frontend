import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoCheckmarkCircle, IoDocumentTextOutline } from 'react-icons/io5';
import { createProposal } from '../../api/dataProposals';
import { getTags } from '../../api/tags';
import { Modal, Button, Select, TextArea, Input, Alert, Checkbox } from '../../components/ui';
import { PROPOSAL_CATEGORIES } from '../../utils/constants';


// Field definitions for each data category
const CATEGORY_FIELDS = {
  ENGINE: [
    { name: 'engineCode', label: 'Engine Code', type: 'text' },
    { name: 'displacement', label: 'Displacement (cc)', type: 'number' },
    { name: 'engineType', label: 'Engine Type', type: 'text' },
    { name: 'maxPower', label: 'Max Power (HP)', type: 'number' },
    { name: 'maxPowerRotationSpeed', label: 'Max Power RPM', type: 'number' },
    { name: 'maxTorque', label: 'Max Torque (Nm)', type: 'number' },
    { name: 'maxTorqueRotationSpeed', label: 'Max Torque RPM', type: 'number' },
    { name: 'cylindersNumber', label: 'Cylinders', type: 'number' },
    { name: 'valvesNumber', label: 'Valves', type: 'number' },
    { name: 'turbo', label: 'Turbo', type: 'text' },
  ],
  TRANSMISSION: [
    { name: 'transmissionType', label: 'Type', type: 'text' },
    { name: 'transmissionName', label: 'Name', type: 'text' },
    { name: 'gearsNumber', label: 'Gears', type: 'number' },
    { name: 'clutchType', label: 'Clutch Type', type: 'text' },
  ],
  CHASSIS: [
    { name: 'drive', label: 'Drive Type', type: 'text' },
    { name: 'suspension', label: 'Suspension', type: 'text' },
    { name: 'frontBrakes', label: 'Front Brakes', type: 'text' },
    { name: 'backBrakes', label: 'Rear Brakes', type: 'text' },
    { name: 'frontBrakesRadius', label: 'Front Brakes Radius (mm)', type: 'number' },
    { name: 'backBrakesRadius', label: 'Rear Brakes Radius (mm)', type: 'number' },
  ],
  PERFORMANCE: [
    { name: 'maxSpeed', label: 'Max Speed (km/h)', type: 'number' },
    { name: 'acceleration0100', label: '0-100 km/h (s)', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionCity', label: 'City Consumption (L/100km)', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionRoute', label: 'Highway Consumption (L/100km)', type: 'number', step: '0.1' },
    { name: 'fuelConsumptionMixed', label: 'Mixed Consumption (L/100km)', type: 'number', step: '0.1' },
    { name: 'fuelTankCapacity', label: 'Fuel Tank (L)', type: 'number' },
  ],
  OUTSIDE_DIMENSIONS: [
    { name: 'length', label: 'Length (mm)', type: 'number' },
    { name: 'width', label: 'Width (mm)', type: 'number' },
    { name: 'height', label: 'Height (mm)', type: 'number' },
    { name: 'wheelBase', label: 'Wheelbase (mm)', type: 'number' },
    { name: 'clearance', label: 'Ground Clearance (mm)', type: 'number' },
  ],
  INSIDE_DIMENSIONS: [
    { name: 'minTrunkSpace', label: 'Min Trunk Space (L)', type: 'number' },
    { name: 'maxTrunkSpace', label: 'Max Trunk Space (L)', type: 'number' },
    { name: 'heightFromSeatToRoofFront', label: 'Front Headroom (mm)', type: 'number' },
    { name: 'heightFromSeatToRoofBack', label: 'Rear Headroom (mm)', type: 'number' },
  ],
  BASIC_INFO: [
    { name: 'doorsNumber', label: 'Doors', type: 'number' },
    { name: 'seatsNumber', label: 'Seats', type: 'number' },
    { name: 'productionYears', label: 'Production Years', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
  ],
  TAGS: [],
};


// Validation schema
const proposalSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  comment: Yup.string().max(1000, 'Comment cannot exceed 1000 characters'),
});


/**
 * Modal component for submitting data change proposals.
 */
const DataProposalModal = ({ isOpen, onClose, carId, carName, currentTags = [] }) => {
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

  // Form setup
  const formik = useFormik({
    initialValues: {
      category: '',
      comment: '',
      proposedValues: {},
    },
    validationSchema: proposalSchema,
    onSubmit: (values) => {

      // Handle TAGS category separately
      if (values.category === 'TAGS') {
        const hasChanges = tagChanges.addTagIds.length > 0 || tagChanges.removeTagIds.length > 0;
        
        if (!hasChanges) {
          formik.setFieldError('category', 'Please select at least one tag to add or remove');
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
        formik.setFieldError('category', 'Please fill in at least one field with proposed changes');
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
      title="Suggest Data Correction"
      size="lg"
    >
      {submitSuccess ? (
        <div className="text-center py-8">
          <IoCheckmarkCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
            Proposal submitted!
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Thank you for helping improve our database. Your proposal will be reviewed by our team.
          </p>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* Error alert */}
          {createMutation.isError && (
            <Alert variant="error" title="Submission failed">
              {createMutation.error?.response?.data?.message || 'Failed to submit proposal. Please try again.'}
            </Alert>
          )}

          {/* Info box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <IoDocumentTextOutline className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Suggesting corrections for <span className="font-medium">{carName}</span>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Only fill in the fields you want to correct. Leave others empty.
              </p>
            </div>
          </div>

          {/* Category select */}
          <Select
            label="Category"
            name="category"
            options={[
              { value: '', label: 'Select category...' },
              ...PROPOSAL_CATEGORIES,
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
                Proposed Values
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedFields.map(field => (
                  <Input
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    step={field.step}
                    name={`proposedValues.${field.name}`}
                    value={formik.values.proposedValues[field.name] || ''}
                    onChange={formik.handleChange}
                    placeholder={`Enter new ${field.label.toLowerCase()}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tag selection for TAGS category */}
          {formik.values.category === 'TAGS' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Modify Tags
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Check tags to add or uncheck current tags to remove them.
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
