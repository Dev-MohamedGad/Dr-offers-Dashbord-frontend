import { ElementType } from 'react';

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
