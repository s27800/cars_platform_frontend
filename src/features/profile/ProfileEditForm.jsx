import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { IoPersonOutline, IoMailOutline } from 'react-icons/io5';
import { Button, Input, Alert } from '../../components/ui';


const ProfileEditForm = ({ 
  user, 
  onSubmit, 
  isLoading = false, 
  error = null,
  success = false,
}) => {
  const { t } = useTranslation('profile');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation:email.invalid', 'Invalid email address'))
      .required(t('validation:email.required', 'Email is required')),
    firstName: Yup.string()
      .max(50, t('validation:firstName.max', 'First name must be at most 50 characters')),
    lastName: Yup.string()
      .max(50, t('validation:lastName.max', 'Last name must be at most 50 characters')),
  });

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const hasChanges = 
    formik.values.email !== (user?.email || '') ||
    formik.values.firstName !== (user?.firstName || '') ||
    formik.values.lastName !== (user?.lastName || '');

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title={t('editProfile.error')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title={t('editProfile.success')}>
          {t('messages.profileUpdated')}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          label={t('editProfile.email')}
          name="email"
          type="email"
          placeholder={t('editProfile.email')}
          leftIcon={<IoMailOutline className="w-5 h-5" />}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
          disabled={isLoading}
        />

        <Input
          label={t('editProfile.firstName')}
          name="firstName"
          type="text"
          placeholder={t('editProfile.firstName')}
          leftIcon={<IoPersonOutline className="w-5 h-5" />}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && formik.errors.firstName}
          disabled={isLoading}
        />

        <Input
          label={t('editProfile.lastName')}
          name="lastName"
          type="text"
          placeholder={t('editProfile.lastName')}
          leftIcon={<IoPersonOutline className="w-5 h-5" />}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && formik.errors.lastName}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading || !formik.isValid || !hasChanges}
        >
          {isLoading ? t('editProfile.saving') : t('editProfile.save')}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
