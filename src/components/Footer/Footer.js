import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AnnouncementIcon from '@material-ui/icons/Announcement'

import TalkUsModal from './TalkUsModal'

const appVersion = process.env.REACT_APP_PROJECT_VERSION.split('/').pop()
const useStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start'
    }
  },
  labelfooter: {
    fontSize: 12.1,
    fontWeight: '500',
    lineHeight: 1.32,
    letterSpacing: '0.4px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: -100
    }
  },
  labelVersion: {
    width: 100,
    fontWeight: '600',
    marginTop: -5,
    marginLeft: '0px !important',
    '&:hover': {
      cursor: 'auto'
    }
  },
  iconButton: {
    width: 20,
    height: 20,
    color: '#272863',
    marginLeft: 5
  },
  boxFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      alignItems: 'initial',
      width: 'calc(100% - 73px)'
    }
  }
}))

const Footer = () => {
  const classes = useStyles()
  const { t } = useTranslation('translations')
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <TalkUsModal openModal={openModal} setOpenModal={setOpenModal} />
      <Box className={classes.footer}>
        <Typography
          variant="body1"
          className={clsx(classes.labelfooter, classes.labelVersion)}
        >
          {appVersion}
        </Typography>
        <Box className={classes.boxFooter}>
          <Typography
            variant="body1"
            className={classes.labelfooter}
            onClick={() => setOpenModal(!openModal)}
          >
            {t('footer')}
          </Typography>
          <AnnouncementIcon
            className={classes.iconButton}
            onClick={() => setOpenModal(!openModal)}
          />
        </Box>
      </Box>
    </>
  )
}

export default Footer
