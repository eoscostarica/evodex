import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import AnnouncementIcon from '@material-ui/icons/Announcement'

import TalkUsModal from './TalkUsModal'

const appVersion = process.env.REACT_APP_PROJECT_VERSION

const useStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  labelfooter: {
    fontSize: 12.1,
    fontWeight: '500',
    lineHeight: 1.32,
    letterSpacing: '0.4px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    display: 'flex',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  iconButton: {
    width: 20,
    height: 20,
    color: '#272863',
    paddingLeft: 5
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
        <Link
          onClick={() => setOpenModal(!openModal)}
          className={classes.labelfooter}
        >
          {`${t('footer')} ${appVersion}`}
          <AnnouncementIcon className={classes.iconButton} />
        </Link>
      </Box>
    </>
  )
}

export default Footer
