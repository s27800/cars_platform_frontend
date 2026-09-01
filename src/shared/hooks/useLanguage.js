import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';


// Reads the language context and fails loudly outside its provider
const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context)
    throw new Error('useLanguage must be used within a LanguageProvider');

  return context;
};

export default useLanguage;
