import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { AppSidebarNav } from '../components/AppSidebarNav';
import { getNavItemsForRole } from '../../_nav';
import { RootState } from '../redux';
import './AppSidebar.css';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state: RootState) => state.layout.sidebarUnfoldable);
  const sidebarShow = useSelector((state: RootState) => state.layout.sidebarShow);
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  // Get user role from Redux state, fallback to 'admin' if no user
  const userRole = user?.role || 'admin';
  
  // Filter navigation items based on user role
  const navigationItems = getNavItemsForRole(userRole);

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
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
