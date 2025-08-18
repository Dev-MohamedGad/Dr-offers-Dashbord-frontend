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
import { NavItem } from './src/types/nav.types';

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
    roles: ['admin'], // Only visible to admin role (hidden from owner)
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
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['admin'], // Only visible to admin role (hidden from owner)
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
