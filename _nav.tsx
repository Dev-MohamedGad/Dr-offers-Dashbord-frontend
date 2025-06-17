import React, { ElementType } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilHome,
  cilTag,
  cilGrid,
  cilApplications,
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
    name: 'Brands',
    to: '/brands',
    icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Offers',
    to: '/offers',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
];

export default _nav;
