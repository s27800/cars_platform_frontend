/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - automotive dark blue
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0056e6',
          600: '#0044b3',
          700: '#003380',
          800: '#00224d',
          900: '#00111a',
        },
        // Accent - racing red/orange
        accent: {
          50: '#fff1f0',
          100: '#ffd6d1',
          200: '#ffb3ab',
          300: '#ff8f85',
          400: '#ff6b5e',
          500: '#e63946',
          600: '#cc2936',
          700: '#991f29',
          800: '#66141b',
          900: '#330a0e',
        },
        // Neutral - automotive grays
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Success
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        // Warning
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        // Error
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px -4px rgba(0, 0, 0, 0.15), 0 8px 24px -8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
