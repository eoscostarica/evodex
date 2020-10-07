import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
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
import DescriptionIcon from '@material-ui/icons/Description'

import MediumIcon from 'components/Icons/MediumIcon'
import CustomRouterLink from 'components/CustomRouterLink'

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
  },
  boxLinks: {
    display: 'flex',
    color: theme.palette.primary.dark,
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    padding: theme.spacing(1.5, 2),
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'rgba(33, 33, 33, 0.04)',
      textDecoration: 'none'
    }
  }
}))

const TOOLS = [
  {
    title: 'exchange',
    href: '/exchange',
    icon: <ImportExportIcon />
  },
  {
    title: 'liquidity',
    href: '/liquidity',
    icon: <InvertColorsIcon />
  },
  {
    title: 'voteFee',
    href: '/fee',
    icon: <ThumbUpAltIcon />
  }
]

const INFO = [
  {
    title: 'about',
    href: '/about',
    icon: <InfoIcon />
  },
  {
    title: 'faq',
    href: '/faq',
    icon: <HelpIcon />
  },
  {
    title: 'contracts',
    href: '/ricardian-contract',
    icon: <DescriptionIcon />
  }
]

const SOCIAL = [
  {
    title: 'Telegram',
    href: 'https://t.me/evodex_io',
    icon: <TelegramIcon />
  },
  {
    title: 'Twitter',
    href: 'https://twitter.com/evodex_io',
    icon: <TwitterIcon />
  }
]

const DashboardSidebarContent = ({ setOpenSidebar }) => {
  const classes = useStyles()
  const { t } = useTranslation('sidebar')

  return (
    <List className={classes.nav}>
      <span className={classes.title}>{t('tool')}</span>
      {TOOLS.map((tool) => (
        <ListItem className={classes.item} disableGutters key={tool.title}>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={tool.href}
            onClick={() => setOpenSidebar(false)}
          >
            <div className={classes.icon}>{tool.icon}</div>
            {t(tool.title)}
          </Button>
        </ListItem>
      ))}
      <Divider className={classes.divider} />
      <span className={classes.title}>{t('information')}</span>
      {INFO.map((info) => (
        <ListItem className={classes.item} disableGutters key={info.title}>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={info.href}
            onClick={() => setOpenSidebar(false)}
          >
            <div className={classes.icon}>{info.icon}</div>
            {t(info.title)}
          </Button>
        </ListItem>
      ))}
      <ListItem className={classes.item} disableGutters>
        <Link
          className={classes.boxLinks}
          href="https://github.com/eoscostarica/evodex"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpenSidebar(false)}
        >
          <div className={classes.icon}>
            <GitHubIcon />
          </div>
          <Typography variant="body1">Github</Typography>
        </Link>
      </ListItem>
      <Divider className={classes.divider} />
      <span className={classes.title}>{t('social')}</span>
      <ListItem className={classes.item} disableGutters>
        <Link
          className={classes.boxLinks}
          href="https://medium.com/eos-argentina"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpenSidebar(false)}
        >
          <MediumIcon classes={classes.icon} color="#0000008a" />
          <Typography variant="body1">Medium</Typography>
        </Link>
      </ListItem>
      {SOCIAL.map((social) => (
        <ListItem className={classes.item} disableGutters key={social.title}>
          <Link
            className={classes.boxLinks}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpenSidebar(false)}
          >
            <div className={classes.icon}>{social.icon}</div>
            <Typography variant="body1">{t(social.title)}</Typography>
          </Link>
        </ListItem>
      ))}
    </List>
  )
}

DashboardSidebarContent.propTypes = {
  setOpenSidebar: PropTypes.func
}

export default DashboardSidebarContent
