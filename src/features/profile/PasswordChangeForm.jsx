import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Button, Input, Alert } from '../../components/ui';


const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password'),
  confirmPassword: Yup.string()
    .required('Please confirm your new password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});


const PasswordToggleButton = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
    tabIndex={-1}
  >
    {show ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
  </button>
);


const PasswordChangeForm = ({ 
  onSubmit, 
  isLoading = false, 
  error = null,
  success = false,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await onSubmit({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      if (result?.success)
        resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title="Password change failed">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Password changed">
          Your password has been changed successfully.
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          label="Current Password"
          name="currentPassword"
          type={showCurrentPassword ? 'text' : 'password'}
          placeholder="Enter your current password"
          leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
          rightIcon={
            <PasswordToggleButton 
              show={showCurrentPassword} 
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)} 
            />
          }
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.currentPassword && formik.errors.currentPassword}
          disabled={isLoading}
        />

        <Input
          label="New Password"
          name="newPassword"
          type={showNewPassword ? 'text' : 'password'}
          placeholder="Enter your new password"
          leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
          rightIcon={
            <PasswordToggleButton 
              show={showNewPassword} 
              onToggle={() => setShowNewPassword(!showNewPassword)} 
            />
          }
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && formik.errors.newPassword}
          disabled={isLoading}
          hint="Password must be at least 6 characters"
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your new password"
          leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
          rightIcon={
            <PasswordToggleButton 
              show={showConfirmPassword} 
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
            />
          }
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="danger"
          loading={isLoading}
          disabled={isLoading || !formik.isValid || !formik.dirty}
        >
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
