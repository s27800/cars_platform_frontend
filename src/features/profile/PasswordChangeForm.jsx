import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { Button, Input, Alert } from '../../components/ui';


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
  const { t } = useTranslation('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required(t('validation:password.required', 'Current password is required')),
    newPassword: Yup.string()
      .required(t('validation:password.required', 'New password is required'))
      .min(8, t('validation:password.minLength', 'Password must be at least 8 characters'))
      .max(72, t('validation:password.maxLength', 'Password cannot exceed 72 characters'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        t('validation:password.pattern', 'Password must contain a lowercase letter, an uppercase letter and a digit')
      )
      .notOneOf([Yup.ref('currentPassword')], t('validation:password.mustBeDifferent', 'New password must be different from current password')),
    confirmPassword: Yup.string()
      .required(t('validation:password.confirmRequired', 'Please confirm your new password'))
      .oneOf([Yup.ref('newPassword')], t('validation:password.mustMatch', 'Passwords must match')),
  });

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
        <Alert variant="error" title={t('changePassword.error')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title={t('changePassword.success')}>
          {t('changePassword.success')}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          label={t('changePassword.currentPassword')}
          name="currentPassword"
          type={showCurrentPassword ? 'text' : 'password'}
          placeholder={t('changePassword.currentPasswordPlaceholder')}
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
          label={t('changePassword.newPassword')}
          name="newPassword"
          type={showNewPassword ? 'text' : 'password'}
          placeholder={t('changePassword.newPasswordPlaceholder')}
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
          hint={t('validation:password.hint', 'At least 8 characters, with a lowercase letter, an uppercase letter and a digit')}
        />

        <Input
          label={t('changePassword.confirmPassword')}
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder={t('changePassword.confirmPasswordPlaceholder')}
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
          {isLoading ? t('changePassword.submitting') : t('changePassword.submit')}
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
