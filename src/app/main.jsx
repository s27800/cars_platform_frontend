import { StrictMode, useEffect, useContext, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../shared/api/queryClient';
import { AuthProvider, ThemeProvider, ToastProvider, ToastContext, LanguageProvider } from '../shared/contexts';
import { ErrorBoundary } from '../shared/components';
import { Spinner, ToastContainer } from '../shared/components/ui';
import { setToastRef } from '../shared/utils/toastBus';
import App from './App.jsx';
import '../i18n';
import './index.css';


// Hands the toast API to the plain modules that cannot use a hook
const ToastInitializer = ({ children }) => {
  const toast = useContext(ToastContext);

  useEffect(() => {
    setToastRef(toast);

    return () => setToastRef(null);
  }, [toast]);

  return children;
};

// Shown while i18next loads its resources
const I18nLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<I18nLoader />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ToastProvider>
                <ToastInitializer>
                  <ErrorBoundary>
                    <App />
                  </ErrorBoundary>
                  <ToastContainer />
                </ToastInitializer>
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  </StrictMode>
);
