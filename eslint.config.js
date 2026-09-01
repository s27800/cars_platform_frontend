import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'


// Globals injected by Vitest when `globals: true`
const vitestGlobals = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  vi: 'readonly',
  suite: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
}

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results']),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  {
    files: ['*.config.js', '*.config.{cjs,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    files: [
      '**/__tests__/**/*.{js,jsx}',
      '**/*.{test,spec}.{js,jsx}',
      'src/test/**/*.{js,jsx}',
    ],
    languageOptions: {
      globals: { ...globals.node, ...vitestGlobals },
    },
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  {
    files: ['src/shared/contexts/**/*.jsx', 'src/app/main.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
