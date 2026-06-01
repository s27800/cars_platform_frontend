import { useState, useMemo, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoCheckmarkCircle, IoDocumentTextOutline } from 'react-icons/io5';
import { createProposal } from '../../api/dataProposals';
import { Modal, Button, Select, TextArea, Input, Alert } from '../../components/ui';
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
};


// Validation schema
const proposalSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  comment: Yup.string().max(1000, 'Comment cannot exceed 1000 characters'),
});


/**
 * Modal component for submitting data change proposals.
 */
const DataProposalModal = ({ isOpen, onClose, carId, carName }) => {
  const queryClient = useQueryClient();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formikRef = useRef(null);

  const handleClose = useCallback(() => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    setSubmitSuccess(false);
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

  formikRef.current = formik;

  const selectedFields = useMemo(() => 
    CATEGORY_FIELDS[formik.values.category] || [],
    [formik.values.category]
  );

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
            onChange={(e) => {
              formik.setFieldValue('category', e.target.value);
              formik.setFieldValue('proposedValues', {});
            }}
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
