import Evodex from './Evodex'
import NotFound from './NotFound'
import Dashboard from './Dashboard/Dashboard'

export default [
  {
    name: 'evodex',
    path: '/evodex',
    component: Evodex
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: Dashboard
  },
  {
    name: 'notFound',
    path: '/not-found',
    component: NotFound
  }
]
