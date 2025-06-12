import React, { LazyExoticComponent, FC, ReactNode } from 'react';

export type Route = {
  element?: LazyExoticComponent<FC>;
  exact?: boolean;
  name?: ReactNode;
  path?: string;
  routes?: Route[];
};

const Dashboard = React.lazy(() => import('@pages/homePage/homePage.page'));
const UsersPagee = React.lazy(() => import('@pages/usersPage/usersPage.page'));
const UserDetails = React.lazy(() => import('@pages/usersPage/userDetails'));
const Opportunities = React.lazy(
  () => import('@pages/opportunityPage/opportunityPage.page')
);
const OpportunityDetails = React.lazy(
  () => import('@pages/opportunityPage/OpportunityDetails')
);

const Bookings = React.lazy(
  () => import('@pages/bookingPage/bookingPage.page')
);
const BookingDetails = React.lazy(
  () => import('@pages/bookingPage/bookingDetails')
);
const NewsletterPage = React.lazy(
  () => import('@pages/newsLetterPage/newsLetterPage.page')
);
const PromotionsPage = React.lazy(
  () => import('@pages/promotionsPage/promotionsPage.page')
);
const PromotionDetails = React.lazy(
  () => import('@pages/promotionsPage/promotionsDetails')
);  

const DevelopersPage = React.lazy(() => import('@pages/developersPage/developersPage.page'));
const DeveloperDetails = React.lazy(() => import('@pages/developersPage/developerDetails'));

const routes: Route[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/users',
    name: 'Users',
    element: UsersPagee,
  },
  {
    path: '/user/:id',
    name: 'User Details',
    element: UserDetails,
  },
  {
    path: '/opportunities',
    name: 'Opportunities',
    element: Opportunities,
  },
  {
    path: '/opportunities/:id',
    name: 'Opportunity Details',
    element: OpportunityDetails,
  },

 
  {
    path: '/booking',
    name: 'Booking',
    element: Bookings,
  },
  {
    path: '/booking/:id',
    name: 'Booking  Details',
    element: BookingDetails,
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    element: NewsletterPage,
  },
  {
    path: '/developers',
    name: 'Developers',
    element: DevelopersPage,
  },
  {
    path: '/developer/:id',
    name: 'Developer Details',
    element: DeveloperDetails,}
,{    path: '/promotions',
    name: 'Promotions',
    element: PromotionsPage,
  },
  {
    path: '/promotion/:id',
    name: 'Promotion Details',
    element: PromotionDetails,
  },

  
];

export default routes;
