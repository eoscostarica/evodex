import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

import { ualConfig } from 'config'
import TourGuide from 'components/TourGuide'
import InputTextAndSelect from 'components/InputTextAndSelect'
import EvodexRocketSvg from 'components/Icons/EvodexRocket'
import MessageLink from 'components/MessageLink'
import Button from 'components/Button'
import { useExchange } from 'context/exchange.context'
import { evolutiondex, commonStyles } from 'utils'

const useStyles = makeStyles((theme) => {
  const {
    rocketSvg,
    btnExchange,
    titleBox,
    message,
    loading,
    helpText
  } = commonStyles(theme)

  return {
    feeRoot: {
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
        padding: theme.spacing(3, 0, 0, 0)
      }
    },
    titleBox: {
      ...titleBox,
      '& p': {
        fontSize: 20.2,
        letterSpacing: '0.2px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 400
      },
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        width: '70% !important',
        '& h4': {
          fontSize: '33px !important',
          letterSpacing: '-0.49px !important',
          color: '#ffffff',
          fontWeight: 'bold'
        },
        '& p': {
          fontSize: '16.2px !important',
          letterSpacing: '0.2px !important',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: 400
        }
      },
      [theme.breakpoints.up('sm')]: {
        width: '100%',
        '& p': {
          fontSize: 20.2,
          letterSpacing: '0.25px'
        },
        '& h4': {
          letterSpacing: '-0.91px',
          fontSize: 59.2
        }
      },
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(0)
      }
    },
    rateFeeBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& p': {
        fontSize: 16.2,
        fontWeight: 500,
        letterSpacing: '0.5px',
        lineHeight: 1.73,
        color: '#fff'
      },
      [theme.breakpoints.up('md')]: {
        width: 800
      }
    },
    btnExchange: {
      ...btnExchange,
      alignItems: 'center',
      flexDirection: 'column',
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        paddingTop: theme.spacing(1)
      },
      [theme.breakpoints.up('md')]: {
        width: 500
      }
    },
    inputBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      padding: theme.spacing(2, 0),
      '& .MuiTextField-root': {
        width: '100%'
      },
      '& svg': {
        color: '#fff',
        fontSize: 30,
        margin: theme.spacing(3, 0)
      },
      [theme.breakpoints.up('md')]: {
        width: 800
      }
    },
    contentWrapper: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    helpText,
    message,
    loading,
    rocketSvg
  }
})

const FeeBackLayer = ({
  onReload,
  ual,
  isLightMode,
  showMessage,
  getTourSteps
}) => {
  const classes = useStyles()
  const { t } = useTranslation('fee')
  const [{ pairs, currentPair }] = useExchange()
  const [pair, setPair] = useState()
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [showHelperText, setShowHelperText] = useState('')
  const [yourVote, setYourVote] = useState({})
  const [loading, setLoading] = useState(false)
  const validInput = RegExp('^([0-9]+([.][0-9]*)?|[.][0-9]+)$')

  const handleOnChange = (value) => {
    setYourVote((prevState) => ({
      ...prevState,
      ...value
    }))
  }

  const handleOnVote = async () => {
    if (!ual.activeUser) {
      showMessage({ type: 'warning', content: t('noUser') })
      return
    }

    if (!pair) {
      showMessage({
        type: 'warning',
        content: t('noTokenSelected')
      })
      return
    }

    if (!yourVote.inputValue) {
      showMessage({
        type: 'warning',
        content: t('noVote')
      })
      return
    }

    setLoading(true)

    try {
      const { transactionId } = await evolutiondex.voteFee(
        yourVote.inputValue,
        pair,
        ual
      )
      showMessage((prevState) => ({
        ...prevState,
        type: 'success',
        content: (
          <MessageLink
            text={`${t('successTransaction')}: `}
            href={`${ualConfig.blockExplorerUrl}/transaction/${transactionId}`}
            transactionId={transactionId}
          />
        )
      }))
      onReload()
    } catch (error) {
      showMessage((prevState) => ({
        ...prevState,
        type: 'error',
        content: error.message
      }))
    }

    setLoading(false)
  }

  useEffect(() => {
    setPair(pairs.find((pair) => pair.token === yourVote.selectValue))
  }, [pairs, yourVote.selectValue])

  useEffect(() => {
    if (!currentPair) {
      return
    }

    setYourVote((prevValue) => ({
      ...prevValue,
      selectValue: currentPair.token
    }))
  }, [showMessage, currentPair])

  return (
    <Box className={classes.feeRoot}>
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">{t('title')}</Typography>
        <Typography variant="body1">{t('description')}</Typography>
      </Box>
      <Box className={classes.contentWrapper}>
        <Box className={classes.inputBox}>
          <InputTextAndSelect
            options={pairs.map((pair) => ({
              value: pair.token,
              label: pair.token
            }))}
            id="feeYouVote"
            containerId="youGive"
            label={t('inputLabel')}
            onChange={handleOnChange}
            value={yourVote}
            placeholder={t('placeholder')}
            helperText={showHelperText}
            suffix="%"
            isValueAllowed={(value) => {
              if (!value) {
                return true
              }

              if (!validInput.test(value)) {
                return false
              }

              const floatValue = parseFloat(value)

              if (floatValue < 0 || value === '00') return false

              if (floatValue > 3) {
                setShowHelperText(t('maxValueAllowed'))

                return false
              }

              setShowHelperText(floatValue === 0 ? t('minValueAllowed') : '')
              return true
            }}
          />
        </Box>
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>{`${t('supply')}:`}</strong> {pair.supply.toString()}
            </Typography>
            <Typography variant="body1">
              <strong>{`${t('fee')}:`}</strong> {Number(pair.fee) / 100}%
            </Typography>
          </Box>
        )}
        {loading && (
          <LinearProgress className={classes.loading} color="secondary" />
        )}
        <Box className={classes.btnExchange}>
          <Button
            onClick={handleOnVote}
            variant="contained"
            isLightMode={isLightMode}
          >
            {t('inputLabel').toLocaleUpperCase()}
          </Button>
          <Typography
            onClick={() => setIsTourOpen(true)}
            variant="body1"
            className={classes.helpText}
          >
            {t('help').toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <TourGuide
        isTourOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
        stepsByPage="fee"
      />
    </Box>
  )
}

FeeBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func,
  getTourSteps: PropTypes.func
}

export default FeeBackLayer
