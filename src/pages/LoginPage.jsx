import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../hooks';
import { Button, Input } from '../components/ui';


const LoginPage = () => {
  const { t } = useTranslation('auth');
  const { t: tValidation } = useTranslation('validation');
  const { login, isLoading, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validationSchema = Yup.object({
    username: Yup.string()
      .required(tValidation('username.required'))
      .min(3, tValidation('username.minLength')),
    password: Yup.string()
      .required(tValidation('password.required'))
      .min(6, tValidation('password.minLength')),
  });

  if (isAuthenticated)
    return <Navigate to={from} replace />;

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        clearError();
        await login(values);
        navigate(from, { replace: true });
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
              {t('login.title')}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <Input
              label={t('login.username')}
              name="username"
              type="text"
              placeholder={t('login.usernamePlaceholder')}
              leftIcon={<IoPersonOutline className="w-5 h-5" />}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && formik.errors.username}
              disabled={isLoading}
            />

            <Input
              label={t('login.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('login.passwordPlaceholder')}
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

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              disabled={isLoading || !formik.isValid}
            >
              {t('login.submit')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('login.noAccount')}{' '}
              <Link 
                to="/register" 
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {t('login.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
