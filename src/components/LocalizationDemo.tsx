import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentLanguage, selectDirection, selectIsRTL } from '@redux/slices/languageSlice/languageSlice';
import { CCard, CCardBody, CCardHeader, CBadge } from '@coreui/react-pro';

const LocalizationDemo: React.FC = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const direction = useSelector(selectDirection);
  const isRTL = useSelector(selectIsRTL);

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h4>{t('common.language')} Demo</h4>
      </CCardHeader>
      <CCardBody>
        <div className="mb-3">
          <strong>{t('common.status')}:</strong>
          <CBadge color="success" className="ms-2">
            {t('common.active')}
          </CBadge>
        </div>
        
        <div className="mb-3">
          <strong>Current Language:</strong> 
          <span className="ms-2">{currentLanguage.toUpperCase()}</span>
        </div>
        
        <div className="mb-3">
          <strong>Direction:</strong> 
          <span className="ms-2">{direction}</span>
        </div>
        
        <div className="mb-3">
          <strong>Is RTL:</strong> 
          <span className="ms-2">{isRTL ? 'Yes' : 'No'}</span>
        </div>

        <div className="mb-3">
          <h5>{t('navigation.dashboard')}</h5>
          <p>{t('dashboard.overview')}</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <CBadge color="primary">{t('navigation.brands')}</CBadge>
          <CBadge color="secondary">{t('navigation.offers')}</CBadge>
          <CBadge color="info">{t('navigation.users')}</CBadge>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default LocalizationDemo;
