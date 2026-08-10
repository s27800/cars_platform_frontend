import { useState, useRef, useEffect } from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';
import { useLanguage } from '../../hooks';


// SVG Flag components
const FlagGB = ({ className = "w-5 h-4" }) => (
  <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FlagPL = ({ className = "w-5 h-4" }) => (
  <svg className={className} viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="5" fill="#fff"/>
    <rect y="5" width="16" height="5" fill="#DC143C"/>
  </svg>
);

const FLAGS = {
  en: FlagGB,
  pl: FlagPL,
};

/**
 * Language switcher dropdown component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showLabel - Show language name
 */
const LanguageSwitcher = ({ className = '', showLabel = true }) => {
  const { language, changeLanguage, availableLanguages, isSyncing } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);
  const CurrentFlag = FLAGS[language];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSyncing}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          text-neutral-600 dark:text-neutral-300
          hover:bg-neutral-100 dark:hover:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
          transition-colors disabled:opacity-50"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {CurrentFlag && <CurrentFlag className="w-5 h-4 rounded-sm shadow-sm" />}
        {showLabel && (
          <>
            <span className="hidden sm:inline">{currentLanguage?.name}</span>
            <IoChevronDownOutline className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 py-1 bg-white dark:bg-neutral-800 
            rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
          role="listbox"
          aria-label="Select language"
        >
          {availableLanguages.map((lang) => {
            const LangFlag = FLAGS[lang.code];
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                role="option"
                aria-selected={lang.code === language}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                  transition-colors
                  ${lang.code === language 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
              >
                {LangFlag && <LangFlag className="w-5 h-4 rounded-sm shadow-sm" />}
                <span>{lang.name}</span>
                {lang.code === language && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
