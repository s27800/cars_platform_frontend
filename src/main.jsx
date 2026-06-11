import { StrictMode, useEffect, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './api/queryClient'
import { AuthProvider, ThemeProvider, ToastProvider, ToastContext } from './contexts'
import { ToastContainer, setToastRef } from './components/ui/Toast'
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


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <ToastInitializer>
              <App />
              <ToastContainer />
            </ToastInitializer>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
