import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import EvodexRocketSvg from 'components/Icons/EvodexRocket'

const useStyles = makeStyles((theme) => ({
  ricardianContractRoot: {
    marginTop: theme.spacing(7),
    padding: theme.spacing(3, 1, 0, 1),
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      marginTop: theme.spacing(4)
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(13)
    }
  },
  titleBox: {
    width: 225,
    paddingLeft: theme.spacing(2),
    '& h4': {
      fontSize: 33,
      letterSpacing: '-0.49px',
      color: '#ffffff',
      fontWeight: 'bold'
    },
    [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
      width: '70% !important',
      '& h4': {
        fontSize: '33px !important',
        letterSpacing: '-0.49px !important',
        color: '#ffffff',
        fontWeight: 'bold'
      }
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      paddingLeft: 0,
      '& h4': {
        letterSpacing: '-0.91px',
        fontSize: 59.2
      }
    }
  },
  rocketSvg: {
    zIndex: 0,
    position: 'absolute',
    height: 260,
    right: '-10px',
    top: 0,
    [theme.breakpoints.up('md')]: {
      top: 62,
      height: 450,
      right: '-50px',
      opacity: 0.2
    }
  }
}))

const RicardianContractBackLayer = () => {
  const classes = useStyles()
  const { t } = useTranslation('ricardianContract')

  return (
    <Box className={classes.ricardianContractRoot}>
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">{t('title')}</Typography>
      </Box>
    </Box>
  )
}

export default RicardianContractBackLayer
