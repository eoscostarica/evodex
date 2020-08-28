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
    paddingRight: 10
  },
  iconButton: {
    width: 20,
    height: 20,
    color: '#272863',
    '&:hover': {
      cursor: 'pointer'
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
        <Link
          className={classes.labelfooter}
          href="https://github.com/eoscostarica/evodex"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${t('footer')} ${appVersion}`}
        </Link>
        <AnnouncementIcon
          className={classes.iconButton}
          onClick={() => setOpenModal(!openModal)}
        />
      </Box>
    </>
  )
}

export default Footer
