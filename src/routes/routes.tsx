import React, { LazyExoticComponent, FC, ReactNode } from 'react';

export type Route = {
  element?: LazyExoticComponent<FC>;
  exact?: boolean;
  name?: ReactNode;
  path?: string;
  routes?: Route[];
};

const Dashboard = React.lazy(() => import('@pages/homePage/homePage.page'));
const UsersPage = React.lazy(() => import('@pages/usersPage/usersPage.page'));
const UserDetails = React.lazy(() => import('@pages/usersPage/userDetails'));

// Activating the new components
const BrandsPage = React.lazy(() => import('@pages/brandsPage/brandsPage.page'));
const BrandDetails = React.lazy(() => import('@pages/brandsPage/brandDetails'));
const OffersPage = React.lazy(() => import('@pages/offersPage/offersPage.page'));
const OfferDetails = React.lazy(() => import('@pages/offersPage/offerDetails'));

const routes: Route[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/brands',
    name: 'Brands',
    element: BrandsPage,
  },
  {
    path: '/brand/:id',
    name: 'Brand Details',
    element: BrandDetails,
  },
  {
    path: '/offers',
    name: 'Offers',
    element: OffersPage,
  },
  {
    path: '/offer/:id',
    name: 'Offer Details',
    element: OfferDetails,
  },
  {
    path: '/users',
    name: 'Users',
    element: UsersPage,
  },
  {
    path: '/user/:id',
    name: 'User Details',
    element: UserDetails,
  },
];

export default routes;
