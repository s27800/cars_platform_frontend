import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import * as userSettingsApi from '../api/userSettings';
import { AuthContext } from './AuthContext';
import { LANGUAGES, LANGUAGE_NAMES } from '../../i18n';
import { STORAGE_KEYS } from '../utils/constants';
import useUserSettings from '../hooks/useUserSettings';


export const LanguageContext = createContext(null);

const isSupported = (language) => Object.values(LANGUAGES).includes(language);

const getStoredLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch {
    // storage is unavailable
  }
};


// Keeps the UI language in step with localStorage and the account settings
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const queryClient = useQueryClient();
  const { settings, isLoading } = useUserSettings();

  const [localLanguage, setLocalLanguage] = useState(
    () => i18n.language || getStoredLanguage() || LANGUAGES.EN
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const language = isSupported(settings?.language) ? settings.language : localLanguage;

  // Update the UI language
  useEffect(() => {
    if (i18n.language !== language)
      i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  // Mirror the account preference
  useEffect(() => {
    if (isSupported(settings?.language))
      storeLanguage(settings.language);
  }, [settings]);

  const changeLanguage = useCallback(async (newLanguage) => {
    if (!isSupported(newLanguage))
      return;

    setLocalLanguage(newLanguage);
    storeLanguage(newLanguage);

    if (!isAuthenticated)
      return;

    queryClient.setQueryData(['user', 'settings'], (previous) => ({ ...previous, language: newLanguage }));

    try {
      setIsSyncing(true);
      await userSettingsApi.updateSettings({ language: newLanguage });
    } catch {
      // the preference is applied locally
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, queryClient]);

  const toggleLanguage = useCallback(() => {
    changeLanguage(language === LANGUAGES.EN ? LANGUAGES.PL : LANGUAGES.EN);
  }, [language, changeLanguage]);

  const availableLanguages = useMemo(() => Object.values(LANGUAGES).map((code) => ({
    code,
    name: LANGUAGE_NAMES[code],
  })), []);

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
