import React from 'react';
import { CFooter } from '@coreui/react-pro';
import { useTranslation } from 'react-i18next';

const AppFooter = () => {
  const { t } = useTranslation();
  
  return (
    <CFooter className="px-4">
      <div>Dr.Offers</div>
      <div className="ms-auto">
        <span className="me-1">{t('footer.poweredBy')}</span>
        {" "} {t('footer.adminPanel')}
      </div>
    </CFooter>
  );
};


export default AppFooter;
