import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as userSettingsApi from '../api/userSettings';
import { AuthContext } from './AuthContext';
import { LANGUAGES, LANGUAGE_NAMES } from '../i18n';


const LANGUAGE_KEY = 'language';

export const LanguageContext = createContext(null);


const getStoredLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_KEY);
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};


export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  
  const [language, setLanguageState] = useState(() => {
    return i18n.language || getStoredLanguage() || LANGUAGES.EN;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync i18n language with state
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // Update document lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Sync with API on login
  useEffect(() => {
    const syncLanguageFromApi = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const settings = await userSettingsApi.getSettings();
        
        if (settings?.language && Object.values(LANGUAGES).includes(settings.language)) {
          setLanguageState(settings.language);
          storeLanguage(settings.language);
          i18n.changeLanguage(settings.language);
        }
      } catch (error) {
        console.warn('Failed to fetch language from API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    syncLanguageFromApi();
  }, [isAuthenticated, i18n]);

  const changeLanguage = useCallback(async (newLanguage) => {
    if (!Object.values(LANGUAGES).includes(newLanguage)) {
      console.error(`Invalid language: ${newLanguage}`);
      return;
    }

    setLanguageState(newLanguage);
    storeLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);

    if (isAuthenticated) {
      try {
        setIsSyncing(true);
        await userSettingsApi.updateSettings({ language: newLanguage });
      } catch (error) {
        console.warn('Failed to sync language to API:', error);
      } finally {
        setIsSyncing(false);
      }
    }
  }, [isAuthenticated, i18n]);

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === LANGUAGES.EN ? LANGUAGES.PL : LANGUAGES.EN;
    changeLanguage(newLanguage);
  }, [language, changeLanguage]);

  const availableLanguages = useMemo(() => 
    Object.values(LANGUAGES).map((value) => ({
      code: value,
      name: LANGUAGE_NAMES[value],
    }))
  , []);

  const value = useMemo(() => ({
    language,
    changeLanguage,
    toggleLanguage,
    availableLanguages,
    isLoading,
    isSyncing,
    LANGUAGES,
    LANGUAGE_NAMES,
  }), [language, changeLanguage, toggleLanguage, availableLanguages, isLoading, isSyncing]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
