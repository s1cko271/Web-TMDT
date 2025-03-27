import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <button 
        className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        {t('language.english')}
      </button>
      <span className="language-divider">|</span>
      <button 
        className={`language-btn ${i18n.language === 'vi' ? 'active' : ''}`}
        onClick={() => changeLanguage('vi')}
      >
        {t('language.vietnamese')}
      </button>
    </div>
  );
};

export default LanguageSelector;