import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { IoWarningOutline } from 'react-icons/io5';
import { Button } from './ui';


/**
 * Error boundary component that catches JavaScript errors anywhere
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV)
      console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error } = this.state;
    const { children, t, fallback } = this.props;

    if (hasError) {
      if (fallback)
        return fallback;

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <IoWarningOutline className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {t('errorBoundary.title')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {t('errorBoundary.description')}
              </p>

              {import.meta.env.DEV && error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left overflow-auto">
                  <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                    {error.toString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={this.handleReset}
              >
                {t('errorBoundary.tryAgain')}
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
              >
                {t('errorBoundary.reload')}
              </Button>
              <Button
                variant="primary"
                onClick={this.handleGoHome}
              >
                {t('errorBoundary.goHome')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default withTranslation()(ErrorBoundary);
