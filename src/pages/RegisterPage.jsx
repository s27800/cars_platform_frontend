import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  IoLockClosedOutline, 
  IoPersonOutline, 
  IoMailOutline,
  IoEyeOutline, 
  IoEyeOffOutline 
} from 'react-icons/io5';
import { useAuth } from '../hooks';
import { Button, Input } from '../components/ui';


const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
});

const RegisterPage = () => {
  const { register, isLoading, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isAuthenticated)
    return <Navigate to="/" replace />;

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        clearError();
        const { confirmPassword, ...registerData } = values;
        void confirmPassword;
        await register(registerData);
        navigate('/', { replace: true });
      } catch {
        // Error handled by AuthContext
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Create account
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Join CarsPlatform today
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                type="text"
                placeholder="John"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
                disabled={isLoading}
              />
              <Input
                label="Last name"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
                disabled={isLoading}
              />
            </div>

            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="johndoe"
              leftIcon={<IoPersonOutline className="w-5 h-5" />}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && formik.errors.username}
              disabled={isLoading}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              leftIcon={<IoMailOutline className="w-5 h-5" />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  tabIndex={-1}
                >
                  {showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              }
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
              disabled={isLoading}
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              leftIcon={<IoLockClosedOutline className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              }
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={isLoading || !formik.isValid}
              className="mt-6"
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
