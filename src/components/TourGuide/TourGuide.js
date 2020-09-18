import React from 'react'
import PropTypes from 'prop-types'
import Tour from 'reactour'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  helper: {
    lineHeight: 1.3,
    color: '#2d2323',
    '& > div': {
      justifyContent: 'center',
      marginTop: theme.spacing(2)
    },
    '& > span': {
      display: 'none'
    },
    '& > button': {
      top: 10,
      right: 10,
      '& > svg': {
        width: 12,
        height: 12
      }
    }
  },
  text: {
    fontSize: 16.2,
    fontWeight: '400',
    lineHeight: 1.48,
    letterSpacing: 0.15,
    color: 'rgba(0, 0, 0, 0.6)',
    margin: 0
  }
}))

const TourGuide = ({ setIsTourOpen, isTourOpen, stepsByPage }) => {
  const { t } = useTranslation('translations')
  const classes = useStyles()
  const steps = {
    fee: [
      {
        selector: '#youGive',
        content: () => <p className={classes.text}>{t('feeStep1')}</p>
      }
    ],
    exchange: [
      {
        selector: '#youGive',
        content: () => <p className={classes.text}>{t('exchangeStep1')}</p>
      },
      {
        selector: '#youReceive',
        content: () => <p className={classes.text}>{t('exchangeStep2')}</p>
      }
    ],
    liquidity: [
      {
        selector: '#youGive',
        content: () => <p className={classes.text}>{t('liquidityStep1')}</p>
      }
    ]
  }

  return (
    <Tour
      steps={steps[stepsByPage]}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
      rounded={10}
      className={classes.helper}
      accentColor="#757575"
      getCurrentStep={(curr) => console.log(`The current step is ${curr + 1}`)}
    />
  )
}

TourGuide.propTypes = {
  setIsTourOpen: PropTypes.func,
  isTourOpen: PropTypes.bool,
  stepsByPage: PropTypes.string
}

export default TourGuide
