import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import TelegramIcon from '@material-ui/icons/Telegram'
import Link from '@material-ui/core/Link'

import Modal from 'components/Modal'

const useStyles = makeStyles((theme) => ({
  talkContent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  btnPortal: {
    backgroundColor: '#272863',
    width: 144,
    height: 36,
    borderRadius: 20,
    marginBottom: theme.spacing(2),
    '& .MuiButton-label': {
      color: '#fff',
      fontSize: 14,
      lineHeight: 1.13,
      letterSpacing: 1.25,
      fontWeight: '600'
    }
  },
  titleBox: {
    marginBottom: theme.spacing(3)
  },
  title: {
    fontSize: 20.2,
    fontWeight: '600',
    marginBottom: theme.spacing(1),
    letterSpacing: 0.25,
    color: 'rgba(0, 0, 0, 0.87)',
    [theme.breakpoints.up('sm')]: {
      fontSize: 24,
      letterSpacing: 0.25
    }
  },
  info: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 1.48,
    letterSpacing: 0.15,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  boxLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272863',
    width: 144,
    height: 36,
    borderRadius: 20,
    '&:hover': {
      textDecoration: 'none',
      cursor: 'pointer'
    },
    '& p': {
      color: '#fff',
      textTransform: 'uppercase',
      fontSize: 14,
      lineHeight: 1.13,
      letterSpacing: 1.25,
      fontWeight: '600'
    },
    [theme.breakpoints.up('sm')]: {
      width: 185
    }
  },
  icon: {
    marginRight: theme.spacing(1),
    color: '#fff',
    height: 20
  },
  marginBottomLink: {
    marginBottom: theme.spacing(2)
  }
}))

const TalkUsModal = ({ openModal, setOpenModal }) => {
  const classes = useStyles()
  const { t } = useTranslation('talkUsModal')

  return (
    <Modal openModal={openModal} setOpenModal={(value) => setOpenModal(value)}>
      <Box className={classes.talkContent}>
        <Box className={classes.titleBox}>
          <Typography variant="h1" className={classes.title}>
            {t('title')}
          </Typography>
          <Typography variant="h3" className={classes.info}>
            {t('description1')}
          </Typography>
          <Typography variant="h3" className={classes.info}>
            {t('description2')}
          </Typography>
          <Typography variant="h3" className={classes.info}>
            {t('description3')}
          </Typography>
        </Box>
        <Link
          className={clsx(classes.boxLinks, classes.marginBottomLink)}
          href="https://github.com/eoscostarica/evodex/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon className={classes.icon} />
          <Typography variant="body1">GitHub</Typography>
        </Link>
        <Link
          className={clsx(classes.boxLinks, classes.marginBottomLink)}
          href="https://t.me/evodexarg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TelegramIcon className={classes.icon} />
          <Typography variant="body1">telegram</Typography>
        </Link>

        <Link
          className={clsx(classes.boxLinks, classes.marginBottomLink)}
          href="https://twitter.com/eosargentina"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon className={classes.icon} />
          <Typography variant="body1">twitter</Typography>
        </Link>
      </Box>
    </Modal>
  )
}

TalkUsModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func
}

export default TalkUsModal
