import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import { useTranslation } from 'react-i18next'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import LanguageSelector from 'components/LanguageSelector'

const useStyles = makeStyles((theme) => ({
  sessionText: {
    fontSize: 20.2,
    fontWeight: '600',
    letterSpacing: '0.25px',
    marginLeft: 5,
    color: theme.palette.primary.contrastText,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline'
    }
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1
  }
}))

const DashboardTopbar = ({ user, handleOnLogout, handleOnLogin }) => {
  const classes = useStyles()
  const { t } = useTranslation('translations')

  return (
    <Box className={classes.box}>
      <LanguageSelector />
      {user && (
        <Box>
          <IconButton color="inherit">
            <AccountCircleIcon />
            <Typography className={classes.sessionText} variant="subtitle1">
              {user.accountName}
            </Typography>
          </IconButton>
          <IconButton color="inherit" onClick={handleOnLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      )}
      {!user && (
        <IconButton color="inherit" onClick={handleOnLogin}>
          <FingerprintIcon />
          <Typography className={classes.sessionText}>{t('login')}</Typography>
        </IconButton>
      )}
    </Box>
  )
}

DashboardTopbar.propTypes = {
  user: PropTypes.object,
  handleOnLogout: PropTypes.func,
  handleOnLogin: PropTypes.func
}

export default DashboardTopbar
