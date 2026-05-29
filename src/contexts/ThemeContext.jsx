import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import * as userSettingsApi from '../api/userSettings';
import { AuthContext } from './AuthContext';


const THEME_KEY = 'theme';

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const ThemeContext = createContext(null);


const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEMES.DARK
      : THEMES.LIGHT;
  }
  return THEMES.LIGHT;
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Failed to store theme:', error);
  }
};

const applyThemeToDocument = (theme) => {
  const root = document.documentElement;
  
  if (theme === THEMES.DARK) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};


export const ThemeProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  
  const [theme, setThemeState] = useState(() => {
    const stored = getStoredTheme();
    return stored || getSystemTheme();
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Theme change listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const stored = getStoredTheme();
      if (!stored) {
        const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        setThemeState(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync with API on login
  useEffect(() => {
    const syncThemeFromApi = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const settings = await userSettingsApi.getSettings();
        
        if (settings?.theme) {
          setThemeState(settings.theme);
          storeTheme(settings.theme);
        }
      } catch (error) {
        console.warn('Failed to fetch theme from API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncThemeFromApi();
  }, [isAuthenticated]);

  const setTheme = useCallback(async (newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) {
      console.error(`Invalid theme: ${newTheme}`);
      return;
    }

    setThemeState(newTheme);
    storeTheme(newTheme);

    if (isAuthenticated) {
      try {
        setIsSyncing(true);
        await userSettingsApi.updateSettings({ theme: newTheme });
      } catch (error) {
        console.warn('Failed to sync theme to API:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [isAuthenticated]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  }, [theme, setTheme]);

  const isDark = useMemo(() => theme === THEMES.DARK, [theme]);

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

export default ThemeProvider;
