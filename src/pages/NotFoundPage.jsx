import { useTranslation } from 'react-i18next';
import { IoHomeOutline, IoArrowBackOutline, IoSearchOutline } from 'react-icons/io5';
import { Button } from '../components/ui';


const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        
        {/* 404 Number */}
        <div className="mb-6">
          <span className="text-8xl sm:text-9xl font-bold bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
          {t('errors.pageNotFound')}
        </h1>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          {t('errors.pageNotFoundDescription')}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            to="/"
            variant="primary"
            size="lg"
            leftIcon={<IoHomeOutline className="w-5 h-5" />}
          >
            {t('errors.goHome')}
          </Button>
          
          <Button
            to="/cars"
            variant="secondary"
            size="lg"
            leftIcon={<IoSearchOutline className="w-5 h-5" />}
          >
            {t('navigation.cars')}
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <IoArrowBackOutline className="w-4 h-4" />
            {t('buttons.back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
