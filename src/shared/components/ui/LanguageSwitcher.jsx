import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronDownOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { useLanguage } from '../../hooks';
import Flag from './Flag';


/**
 * Language switcher dropdown component
 *
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showLabel - Show language name
 */
const LanguageSwitcher = ({ className = '', showLabel = true }) => {
  const { t } = useTranslation();
  const { language, changeLanguage, availableLanguages, isSyncing } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
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
        aria-label={t('a11y.changeLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Flag code={language} />
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
          aria-label={t('a11y.selectLanguage')}
        >
          {availableLanguages.map((lang) => (
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
              <Flag code={lang.code} />
              <span>{lang.name}</span>
              {lang.code === language && (
                <IoCheckmarkOutline className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
