import React, { ElementType } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPeople,
  cilHome,
  cilTag,
  cilGrid,
  cilApplications,
  cilDescription,
  cilPlus,
  cilSettings,
  cilUser,
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
  roles?: string[]; // Add roles property for role-based navigation
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
    name: 'Templates',
    to: '/templates',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    roles: ['owner'], // Only visible to owner role
  },
  {
    component: CNavItem,
    name: 'Add Offer',
    to: '/add-offer',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    roles: ['owner'], // Only visible to owner role
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
];

// Function to filter navigation items based on user role
export const getNavItemsForRole = (userRole: string): NavItem[] => {
  return _nav.filter(item => {
    // If no roles specified, item is visible to all roles
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    // Check if user role is in the allowed roles for this item
    return item.roles.includes(userRole);
  });
};

export default _nav;
