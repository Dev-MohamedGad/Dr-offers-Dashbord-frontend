import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
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
  const currentLocation = useLocation().pathname
  const breadcrumbs = getBreadcrumbs(currentLocation)
  const lastBreadcrumb = breadcrumbs && [...breadcrumbs].pop()

  return (
    <>
      <div className="fs-2 fw-semibold text-primary">{lastBreadcrumb && lastBreadcrumb.name}</div>
      <CBreadcrumb className="mb-4">
        <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <CBreadcrumbItem
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </CBreadcrumbItem>  
          )
        })}
      </CBreadcrumb>
    </>
  )
}

export default AppBreadcrumb
