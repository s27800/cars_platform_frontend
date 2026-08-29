import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
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


const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const { register, isLoading, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required(tValidation('username.required'))
      .min(3, tValidation('username.minLength'))
      .max(20, tValidation('username.maxLength'))
      .matches(/^[a-zA-Z0-9_]+$/, tValidation('username.pattern')),
    email: Yup.string()
      .required(tValidation('email.required'))
      .email(tValidation('email.invalid')),
    password: Yup.string()
      .required(tValidation('password.required'))
      .min(8, tValidation('password.minLength'))
      .max(72, tValidation('password.maxLength'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, tValidation('password.complexity')),
    confirmPassword: Yup.string()
      .required(tValidation('confirmPassword.required'))
      .oneOf([Yup.ref('password')], tValidation('confirmPassword.match')),
    firstName: Yup.string()
      .required(tValidation('firstName.required'))
      .min(2, tValidation('firstName.minLength')),
    lastName: Yup.string()
      .required(tValidation('lastName.required'))
      .min(2, tValidation('lastName.minLength')),
  });

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

  // Redirect authenticated user
  if (isAuthenticated)
    return <Navigate to="/" replace />;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {t('register.title')}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('register.subtitle')}
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
                label={t('register.firstName')}
                name="firstName"
                type="text"
                placeholder={t('register.firstNamePlaceholder')}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && formik.errors.firstName}
                disabled={isLoading}
              />
              <Input
                label={t('register.lastName')}
                name="lastName"
                type="text"
                placeholder={t('register.lastNamePlaceholder')}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && formik.errors.lastName}
                disabled={isLoading}
              />
            </div>

            <Input
              label={t('register.username')}
              name="username"
              type="text"
              placeholder={t('register.usernamePlaceholder')}
              leftIcon={<IoPersonOutline className="w-5 h-5" />}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && formik.errors.username}
              disabled={isLoading}
            />

            <Input
              label={t('register.email')}
              name="email"
              type="email"
              placeholder={t('register.emailPlaceholder')}
              leftIcon={<IoMailOutline className="w-5 h-5" />}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              disabled={isLoading}
            />

            <Input
              label={t('register.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('register.passwordPlaceholder')}
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
              label={t('register.confirmPassword')}
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('register.confirmPasswordPlaceholder')}
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
              {t('register.submit')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('register.hasAccount')}{' '}
              <Link 
                to="/login" 
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {t('register.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
