import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '../locales';

// Languages that use RTL
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific options
    react: {
      useSuspense: false,
    },

    // Default namespace
    defaultNS: 'translation',
    ns: ['translation'],
  });

// Function to check if a language is RTL
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};

// Function to get direction for a language
export const getDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Function to update document direction
export const updateDocumentDirection = (language: string): void => {
  const direction = getDirection(language);
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
  
  // Update body class for RTL styling
  if (direction === 'rtl') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
};

// Set initial direction
updateDocumentDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (language: string) => {
  updateDocumentDirection(language);
});

export default i18n;
