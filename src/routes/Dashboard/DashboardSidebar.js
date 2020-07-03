import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import InputIcon from '@material-ui/icons/Input'

import CustomRouterLink from '../../components/CustomRouterLink'

const useStyles = makeStyles((theme) => ({
  nav: {
    marginBottom: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.primary.dark,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}))

const PAGES = [
  {
    title: 'products',
    href: '/dashboard/products',
    icon: <ShoppingBasketIcon />
  },
  {
    title: 'users',
    href: '/dashboard/users',
    icon: <PeopleIcon />
  }
]

const DashboardSidebarContent = ({ user, onLogout, onLogin }) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')

  return (
    <>
      <List className={classes.nav}>
        {PAGES.map((page) => (
          <ListItem className={classes.item} disableGutters key={page.title}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={page.href}
            >
              <div className={classes.icon}>{page.icon}</div>
              {t(page.title)}
            </Button>
          </ListItem>
        ))}
        {!user && (
          <ListItem className={classes.item} disableGutters>
            <Button
              className={classes.button}
              color="inherit"
              onClick={onLogin}
            >
              <div className={classes.icon}>
                <FingerprintIcon />
              </div>
              {t('login')}
            </Button>
          </ListItem>
        )}
        {user && (
          <ListItem className={classes.item} disableGutters key="logoutOption">
            <Button
              className={classes.button}
              color="inherit"
              onClick={onLogout}
            >
              <div className={classes.icon}>
                <InputIcon />
              </div>
              {t('logout')}
            </Button>
          </ListItem>
        )}
      </List>
    </>
  )
}

DashboardSidebarContent.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  onLogin: PropTypes.func
}

export default DashboardSidebarContent
