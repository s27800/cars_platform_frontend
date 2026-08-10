import { StrictMode, useEffect, useContext, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './api/queryClient'
import { AuthProvider, ThemeProvider, ToastProvider, ToastContext, LanguageProvider } from './contexts'
import { ToastContainer, setToastRef } from './components/ui/Toast'
import { Spinner } from './components/ui'
import './i18n'
import './index.css'
import App from './App.jsx'


const ToastInitializer = ({ children }) => {
  const toast = useContext(ToastContext);
  
  useEffect(() => {
    setToastRef(toast);
    return () => setToastRef(null);
  }, [toast]);
  
  return children;
};

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
                  <App />
                  <ToastContainer />
                </ToastInitializer>
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  </StrictMode>,
)
