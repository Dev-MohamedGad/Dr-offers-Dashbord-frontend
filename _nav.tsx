import React, { ElementType } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilHome,
  cilFindInPage,
  cilMap,
  cilApplications,
  cilWindow,
} from '@coreui/icons';
import { CNavItem } from '@coreui/react-pro';

export type Badge = {
  color: string;
  text: string;
};

export type NavItem = {
  badge?: Badge;
  component: string | ElementType;
  href?: string;
  icon?: string | JSX.Element;
  items?: NavItem[];
  name: string | JSX.Element;
  to?: string;
};

const _nav: NavItem[] = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Developers',
    to: '/developers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Opportunities',
    to: '/opportunities',
    icon: <CIcon icon={cilFindInPage} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Booking',
    to: '/booking',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Newsletter',
    to: '/newsletter',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Promotions',
    to: '/promotions',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
  },
];

export default _nav;
