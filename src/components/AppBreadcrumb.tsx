import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react-pro'

import routes from '../routes/routes'

import { Route } from 'src/routes/routes'

type Breadcrumb = {
  pathname?: string
  name?: boolean | string | ReactNode
  active?: boolean
}

const getRouteName = (pathname: string, routes: Route[]) => {
  const currentRoute = routes.find((route) => route.path === pathname)
  return currentRoute ? currentRoute.name : false
}

const getBreadcrumbs = (location: string) => {
  const breadcrumbs: Breadcrumb[] = []
  location.split('/').reduce((prev, curr, index, array) => {
    const currentPathname = `${prev}/${curr}`
    const routeName = getRouteName(currentPathname, routes)
    routeName &&
      breadcrumbs.push({
        pathname: currentPathname,
        name: routeName,
        active: index + 1 === array.length ? true : false,
      })
    return currentPathname
  })
  return breadcrumbs
}

const AppBreadcrumb = () => {
  const { t } = useTranslation()
  const currentLocation = useLocation().pathname
  const breadcrumbs = getBreadcrumbs(currentLocation)
  const lastBreadcrumb = breadcrumbs && [...breadcrumbs].pop()

  // Function to translate breadcrumb names
  const translateBreadcrumbName = (name: string | ReactNode | boolean) => {
    if (typeof name === 'string') {
      switch (name) {
        case 'Dashboard':
          return t('dashboard.title')
        case 'Brands':
          return t('brands.title')
        case 'Brand Details':
          return t('brands.brandDetails')
        case 'Edit Brand':
          return t('brands.editBrand')
        case 'Offers':
          return t('offers.title')
        case 'Add Offer':
          return t('offers.addOffer')
        case 'Offer Details':
          return t('offers.offerDetails')
        case 'Users':
          return t('users.title')
        case 'User Details':
          return t('users.userDetails')
        default:
          return name
      }
    }
    return name
  }

  return (
    <>
      <div className="fs-2 fw-semibold text-primary">
        {lastBreadcrumb && translateBreadcrumbName(lastBreadcrumb.name)}
      </div>
      <CBreadcrumb className="mb-4">
        <CBreadcrumbItem href="/">{t('navigation.home')}</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {translateBreadcrumbName(breadcrumb.name)}
            </CBreadcrumbItem>  
          )
        })}
      </CBreadcrumb>
    </>
  )
}

export default AppBreadcrumb
