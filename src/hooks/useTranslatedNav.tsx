import React from 'react';
import { useTranslation } from 'react-i18next';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilHome,
  cilTag,
  cilGrid,
  cilApplications,
} from '@coreui/icons';
import { CNavItem } from '@coreui/react-pro';
import { NavItem } from '../types/nav.types';

export const useTranslatedNav = () => {
  const { t } = useTranslation();

  const nav: NavItem[] = [
    {
      component: CNavItem,
      name: t('navigation.dashboard'),
      to: '/dashboard',
      icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('navigation.brands'),
      to: '/brands',
      icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
      roles: ['admin'], // Only visible to admin role (hidden from owner)
    },
    {
      component: CNavItem,
      name: t('navigation.offers'),
      to: '/offers',
      icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('navigation.templates'),
      to: '/templates',
      icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
      roles: ['owner'], // Only visible to owner role
    },
    {
      component: CNavItem,
      name: t('navigation.users'),
      to: '/users',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      roles: ['admin'], // Only visible to admin role (hidden from owner)
    },
  ];

  return nav;
};
