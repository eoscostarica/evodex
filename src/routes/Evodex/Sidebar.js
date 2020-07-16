import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import InfoIcon from '@material-ui/icons/Info'
import HelpIcon from '@material-ui/icons/Help'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import TelegramIcon from '@material-ui/icons/Telegram'
import SmartphoneIcon from '@material-ui/icons/Smartphone'

import CustomRouterLink from '../../components/CustomRouterLink'

const useStyles = makeStyles((theme) => ({
  nav: {
    marginBottom: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0, 4, 0)
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.primary.dark,
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    border: '1px solid red',
    padding: theme.spacing(1.5, 2),
    borderRadius: 0
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
    color: 'rgba(0, 0, 0, 0.54) !important'
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  title: {
    fontSize: 12.1,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.32',
    letterSpacing: '2px',
    color: 'rgba(0, 0, 0, 0.6)',
    textTransform: 'uppercase',
    padding: theme.spacing(2)
  }
}))

const TOOLS = [
  {
    title: 'Exchange Tokens',
    href: '/evodex/exchange',
    icon: <ImportExportIcon />
  },
  {
    title: 'Add or Remove Liquidity',
    href: '/evodex/liquidity',
    icon: <InvertColorsIcon />
  },
  {
    title: 'Fee',
    href: '/evodex/fee',
    icon: <ThumbUpAltIcon />
  }
]

const INFO = [
  {
    title: 'About EvoDex',
    href: '#',
    icon: <InfoIcon />
  },
  {
    title: 'FAQs',
    href: '#',
    icon: <HelpIcon />
  },
  {
    title: 'Github',
    href: '#',
    icon: <GitHubIcon />
  }
]

const SOCIAL = [
  {
    title: 'Medium',
    href: '#',
    icon: <SmartphoneIcon />
  },
  {
    title: 'Telegram',
    href: '#',
    icon: <TelegramIcon />
  },
  {
    title: 'Twitter',
    href: '#',
    icon: <TwitterIcon />
  }
]

const DashboardSidebarContent = ({ user, onLogout, onLogin }) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')

  return (
    <>
      <List className={classes.nav}>
        <span className={classes.title}>Tools</span>
        {TOOLS.map((tool) => (
          <ListItem className={classes.item} disableGutters key={tool.title}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={tool.href}
            >
              <div className={classes.icon}>{tool.icon}</div>
              {t(tool.title)}
            </Button>
          </ListItem>
        ))}
        <Divider className={classes.divider} />
        <span className={classes.title}>Information</span>
        {INFO.map((info) => (
          <ListItem className={classes.item} disableGutters key={info.title}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={info.href}
            >
              <div className={classes.icon}>{info.icon}</div>
              {t(info.title)}
            </Button>
          </ListItem>
        ))}
        <Divider className={classes.divider} />
        <span className={classes.title}>Social</span>
        {SOCIAL.map((social) => (
          <ListItem className={classes.item} disableGutters key={social.title}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={social.href}
            >
              <div className={classes.icon}>{social.icon}</div>
              {t(social.title)}
            </Button>
          </ListItem>
        ))}
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
