import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ThemeProvider, ToastProvider } from '../shared/contexts';


// Create a custom render that includes providers
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});


export const AllProviders = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};


export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { wrapper: AllProviders, ...options });
};


// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };
