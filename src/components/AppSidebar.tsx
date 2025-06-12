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

import { AppSidebarNav } from '../components/AppSidebarNav';

import logo from '@assets/logo.svg';

// sidebar nav config
import navigation from '../../_nav';

import { set, State } from '@redux/slices/layout/layoutSlice';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector(
    (state: { layout: State }) => state.layout.sidebarUnfoldable
  );
  const sidebarShow = useSelector(
    (state: { layout: State }) => state.layout.sidebarShow
  );

  return (
    <CSidebar
      className="bg-dark-gradient shadow-lg border-end bg-gradient rounded-end-3"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible }));
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand as={NavLink} to="/">
          <CImage src={logo} width={80} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(set({ sidebarShow: false }))}
        />
        <CSidebarToggler
          onClick={() => dispatch(set({ sidebarUnfoldable: !unfoldable }))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  );
};

export default AppSidebar;
