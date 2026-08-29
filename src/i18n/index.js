import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import authEN from './locales/en/auth.json';
import carsEN from './locales/en/cars.json';
import reviewsEN from './locales/en/reviews.json';
import profileEN from './locales/en/profile.json';
import adminEN from './locales/en/admin.json';
import validationEN from './locales/en/validation.json';
import pagesEN from './locales/en/pages.json';
import brandsEN from './locales/en/brands.json';

import commonPL from './locales/pl/common.json';
import homePL from './locales/pl/home.json';
import authPL from './locales/pl/auth.json';
import carsPL from './locales/pl/cars.json';
import reviewsPL from './locales/pl/reviews.json';
import profilePL from './locales/pl/profile.json';
import adminPL from './locales/pl/admin.json';
import validationPL from './locales/pl/validation.json';
import pagesPL from './locales/pl/pages.json';
import brandsPL from './locales/pl/brands.json';


export const LANGUAGES = {
  EN: 'en',
  PL: 'pl',
};

export const LANGUAGE_NAMES = {
  en: 'English',
  pl: 'Polski',
};

const resources = {
  en: {
    common: commonEN,
    home: homeEN,
    auth: authEN,
    cars: carsEN,
    reviews: reviewsEN,
    profile: profileEN,
    admin: adminEN,
    validation: validationEN,
    pages: pagesEN,
    brands: brandsEN,
  },
  pl: {
    common: commonPL,
    home: homePL,
    auth: authPL,
    cars: carsPL,
    reviews: reviewsPL,
    profile: profilePL,
    admin: adminPL,
    validation: validationPL,
    pages: pagesPL,
    brands: brandsPL,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: LANGUAGES.EN,
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'cars', 'reviews', 'profile', 'admin', 'validation', 'pages', 'brands'],
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
