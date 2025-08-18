import React from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react-pro';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, selectCurrentLanguage } from '@redux/slices/languageSlice/languageSlice';
import './LanguageToggle.css';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English',
  },
  {
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    nativeName: 'العربية',
  },
];

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      dispatch(setLanguage(languageCode));
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const currentLang = getCurrentLanguage();

  return (
    <CDropdown variant="nav-item" placement="bottom-end" className="language-toggle">
      <CDropdownToggle 
        caret={false} 
        className="language-toggle-btn"
        aria-label={t('languages.changeLanguage')}
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-code d-none d-sm-inline">
          {currentLang.code.toUpperCase()}
        </span>
      </CDropdownToggle>
      
      <CDropdownMenu className="language-dropdown-menu">
        <div className="language-dropdown-header">
          <small className="text-muted">{t('languages.changeLanguage')}</small>
        </div>
        {languages.map((language) => (
          <CDropdownItem
            key={language.code}
            active={currentLanguage === language.code}
            className="language-dropdown-item"
            as="button"
            type="button"
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className="language-flag me-2">{language.flag}</span>
            <span className="language-info">
              <span className="language-name">{language.nativeName}</span>
              <small className="language-english-name text-muted d-block">
                {language.name}
              </small>
            </span>
            {currentLanguage === language.code && (
              <span className="ms-auto text-success">
                <i className="fas fa-check"></i>
              </span>
            )}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default LanguageToggle;
