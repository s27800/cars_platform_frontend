import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as userSettingsApi from '../api/userSettings';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '../utils/constants';
import useUserSettings from '../hooks/useUserSettings';


const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const ThemeContext = createContext(null);


const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia)
    return THEMES.LIGHT;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // storage is unavailable
  }
};

const applyThemeToDocument = (theme) => {
  document.documentElement.classList.toggle('dark', theme === THEMES.DARK);
};


// Keeps the colour scheme in step with the system, localStorage and the account
export const ThemeProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const queryClient = useQueryClient();
  const { settings, isLoading } = useUserSettings();

  const [localTheme, setLocalTheme] = useState(() => getStoredTheme() || getSystemTheme());
  const [isSyncing, setIsSyncing] = useState(false);

  const theme = settings?.theme ?? localTheme;

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Mirror the account preference
  useEffect(() => {
    if (settings?.theme)
      storeTheme(settings.theme);
  }, [settings]);

  // Follow the system setting if theme is not set
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia)
      return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      if (!getStoredTheme())
        setLocalTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback(async (newTheme) => {
    if (!Object.values(THEMES).includes(newTheme))
      return;

    setLocalTheme(newTheme);
    storeTheme(newTheme);

    if (!isAuthenticated)
      return;

    queryClient.setQueryData(['user', 'settings'], (previous) => ({ ...previous, theme: newTheme }));

    try {
      setIsSyncing(true);
      await userSettingsApi.updateSettings({ theme: newTheme });
    } catch {
      // the preference is applied locally
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, queryClient]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  }, [theme, setTheme]);

  const isDark = theme === THEMES.DARK;

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLoading,
    isSyncing,
    THEMES,
  }), [theme, setTheme, toggleTheme, isDark, isLoading, isSyncing]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
