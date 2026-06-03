import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoPersonOutline, IoMailOutline } from 'react-icons/io5';
import { Button, Input, Alert } from '../../components/ui';


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string()
    .max(50, 'First name must be at most 50 characters'),
  lastName: Yup.string()
    .max(50, 'Last name must be at most 50 characters'),
});


const ProfileEditForm = ({ 
  user, 
  onSubmit, 
  isLoading = false, 
  error = null,
  success = false,
}) => {
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
        <Alert variant="error" title="Update failed">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Profile updated">
          Your profile has been updated successfully.
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          leftIcon={<IoMailOutline className="w-5 h-5" />}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
          disabled={isLoading}
        />

        <Input
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Enter your first name"
          leftIcon={<IoPersonOutline className="w-5 h-5" />}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && formik.errors.firstName}
          disabled={isLoading}
        />

        <Input
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Enter your last name"
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
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
