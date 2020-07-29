import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import TelegramIcon from '@material-ui/icons/Telegram'

import CustomRouterLink from '../../components/CustomRouterLink'
import MediumIcon from '../../components/Icons/MediumIcon'

const TOOLS = [
  {
    title: 'EXCHANGE',
    href: '/evodex/exchange'
  },
  {
    title: 'LIQUIDITY',
    href: '/evodex/liquidity'
  },
  {
    title: 'VOTE FEE',
    href: '/evodex/fee'
  },
  {
    title: 'ABOUT',
    href: '/evodex/about'
  },
  {
    title: 'FAQ',
    href: '/evodex/faq'
  }
]
const SOCIAL = [
  {
    href: '#',
    icon: <GitHubIcon />
  },
  {
    href: '#',
    icon: <TelegramIcon />
  },
  {
    href: '#',
    icon: <TwitterIcon />
  }
]

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  navMenu: {
    display: 'flex',
    padding: 0
  },
  navSocial: {
    display: 'flex',
    padding: 0
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    width: 90,
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    '&:hover': {
      borderBottom: '1px solid #fff'
    }
  },
  button: {
    color: '#fff',
    justifyContent: 'center',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    borderRadius: 0,
    '& span': {
      fontSize: 14.1,
      fontWeight: '600',
      lineHeight: 1.13,
      letterSpacing: '1.25px',
      color: '#ffffff'
    }
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      fontSize: 20
    }
  },
  active: {
    borderBottom: '1px solid #fff'
  },
  itemSocial: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    width: 30,
    marginLeft: theme.spacing(1),
    justifyContent: 'center'
  },
  iconMedium: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center'
  }
}))

const Submenu = ({ pathname }) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')

  return (
    <Box className={classes.box}>
      <List className={classes.navMenu}>
        {TOOLS.map((tool, i) => (
          <ListItem
            className={clsx(classes.item, {
              [classes.active]: tool.href === pathname
            })}
            disableGutters
            key={`submenu-${tool.title}-${i}`}
          >
            <Button
              className={classes.button}
              component={CustomRouterLink}
              to={tool.href}
            >
              {t(tool.title)}
            </Button>
          </ListItem>
        ))}
      </List>
      <List className={classes.navSocial}>
        {SOCIAL.map((social, i) => (
          <ListItem
            className={classes.itemSocial}
            disableGutters
            key={`submenu-${social.title}-${i}`}
          >
            <Button
              className={classes.button}
              component={CustomRouterLink}
              to={social.href}
            >
              <div className={classes.icon}>{social.icon}</div>
            </Button>
          </ListItem>
        ))}
        <ListItem className={classes.itemSocial} disableGutters>
          <Button
            className={classes.button}
            component={CustomRouterLink}
            to="#"
          >
            <MediumIcon classes={classes.iconMedium} />
          </Button>
        </ListItem>
      </List>
    </Box>
  )
}

Submenu.propTypes = {
  pathname: PropTypes.string
}

export default Submenu
