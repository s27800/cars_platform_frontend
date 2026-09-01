import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'e2e'],
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/app/layout/**/*.jsx',
        'src/shared/**/*.{js,jsx}',
        'src/features/**/*.{js,jsx}',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        'e2e/',
        '**/*.d.ts',
        'src/app/main.jsx',
        'src/app/App.jsx',
        '**/__tests__/**',
      ],
    },
    reporters: ['verbose'],
  },
})
