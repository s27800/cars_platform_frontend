import { QueryClient } from '@tanstack/react-query';
import { STALE_TIME } from '../utils/constants';


const GC_TIME = 30 * 60 * 1000;
const MAX_RETRIES = 3;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME.LONG,
      gcTime: GC_TIME,

      retry: (failureCount, error) => {
        const status = error?.response?.status;

        if (status >= 400 && status < 500)
          return false;

        return failureCount < MAX_RETRIES;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
