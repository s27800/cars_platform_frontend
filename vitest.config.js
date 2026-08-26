import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/utils/**/*.js',
        'src/hooks/**/*.js',
        'src/contexts/**/*.jsx',
        'src/api/**/*.js',
        'src/components/ui/**/*.jsx',
        'src/components/shared/**/*.jsx',
        'src/components/layout/**/*.jsx',
        'src/features/**/*.jsx',
        'src/pages/**/*.jsx',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        '**/*.d.ts',
        'src/main.jsx',
        'src/App.jsx',
        '**/__tests__/**',
      ],
    },
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
