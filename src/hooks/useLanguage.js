import { useContext } from 'react';
import { LanguageContext } from '../contexts';


/**
 * Hook to access the language context
 * 
 * @returns {object} Language context value
 * @property {string} language - Current language code
 * @property {function} changeLanguage - Function to change the language
 * @property {function} toggleLanguage - Function to toggle between languages
 * @property {Array} availableLanguages - List of available languages
 * @property {boolean} isLoading - Whether language is being loaded from API
 * @property {boolean} isSyncing - Whether language is being synced to API
 * @property {object} LANGUAGES - Language constants
 * @property {object} LANGUAGE_NAMES - Language display names
 */
const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

export default useLanguage;
