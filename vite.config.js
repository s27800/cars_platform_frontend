import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {

          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/'))
            return 'vendor-react';

          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run'))
            return 'vendor-router';

          // React Query
          if (id.includes('node_modules/@tanstack/react-query'))
            return 'vendor-query';

          // Icons library
          if (id.includes('node_modules/react-icons'))
            return 'vendor-icons';

          // Form handling
          if (id.includes('node_modules/formik') || id.includes('node_modules/yup'))
            return 'vendor-forms';

          // HTTP client
          if (id.includes('node_modules/axios'))
            return 'vendor-axios';
        },
      },
    },
    target: 'es2020',
  },

  // Optimize dev server
  server: {
    port: 3000,
    open: true,
  },

  // Preview server config
  preview: {
    port: 4173,
  },
})
