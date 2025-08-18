import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarToggler,
  CButton,
  CSidebarFooter,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { cilPowerStandby, cilSettings } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { AppSidebarNav } from '../components/AppSidebarNav';
import { useTranslatedNav } from '../hooks/useTranslatedNav';
import { selectCurrentLanguage } from '@redux/slices/languageSlice/languageSlice';
import { RootState } from '../redux';
import './AppSidebar.css';

// Function to filter navigation items based on user role
const getNavItemsForRole = (nav: any[], userRole: string) => {
  return nav.filter(item => {
    // If no roles specified, item is visible to all roles
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // Check if user role is in the allowed roles for this item
    return item.roles.includes(userRole);
  });
};

const AppSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const unfoldable = useSelector((state: RootState) => state.layout.sidebarUnfoldable);
  const sidebarShow = useSelector((state: RootState) => state.layout.sidebarShow);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const currentLanguage = useSelector(selectCurrentLanguage);
  
  // Get translated navigation (will re-run when language changes)
  const translatedNav = useTranslatedNav();
  
  // Get user role from Redux state, fallback to 'admin' if no user
  const userRole = user?.role || 'admin';
  
  // Filter navigation items based on user role
  const navigationItems = getNavItemsForRole(translatedNav, userRole);

  // Handle logout functionality
  const handleLogout = () => {
    // Clear user data from Redux
    dispatch({ type: 'user/logout' });
    // Clear auth token
    dispatch({ type: 'auth/logout' });
    // Navigate to login page
    navigate('/login');
  };

  // Handle settings navigation
  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <CSidebar
      className="custom-sidebar d-print-none sidebar sidebar-fixed"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom custom-sidebar-header">
        <CSidebarBrand className="d-md-down-none custom-brand" as={NavLink} to="/">
          <img 
            src="/dr-offer-logo.png" 
            alt="Dr.Offers"
            className="sidebar-brand-full "
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigationItems} />
      
      {/* Sidebar Footer with Action Buttons */}
      <CSidebarFooter className="border-top custom-sidebar-footer">
        <div className="sidebar-bottom-buttons">
          <CButton
            color="light"
            variant="ghost"
            className="sidebar-action-btn settings-btn"
            onClick={handleSettings}
            title={t('sidebar.settings')}
          >
            <CIcon icon={cilSettings} size="lg" />
            <span className="btn-text">{t('sidebar.settings')}</span>
          </CButton>
          
          <CButton
            color="danger"
            variant="ghost"
            className="sidebar-action-btn logout-btn"
            onClick={handleLogout}
            title={t('sidebar.logout')}
          >
            <CIcon icon={cilPowerStandby} size="lg" />
            <span className="btn-text">{t('sidebar.logout')}</span>
          </CButton>
        </div>
      </CSidebarFooter>
      
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default AppSidebar;
