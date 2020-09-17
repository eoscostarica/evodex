import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import HelpIcon from '@material-ui/icons/Help'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'

import { ualConfig } from 'config'
import TourGuide from 'components/TourGuide'
import TitlePage from 'components/PageTitle'
import InputTextAndSelect from 'components/InputTextAndSelect'
import EvodexRocketSvg from 'components/Icons/EvodexRocket'
import MessageLink from 'components/MessageLink'
import Button from 'components/Button'
import { useExchange } from 'context/exchange.context'
import { evolutiondex, commonStyles } from 'utils'

const useStyles = makeStyles((theme) => {
  const { inputBox, rocketSvg, message, loading, helpIcon } = commonStyles(
    theme
  )

  return {
    liquidityRoot: {
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
      width: 250,
      paddingLeft: theme.spacing(2),
      '& h4': {
        fontSize: 33,
        letterSpacing: '-0.49px',
        color: '#ffffff',
        fontWeight: 'bold'
      },
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
        width: 500
      }
    },
    btnExchange: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing(4),
      '& button': {
        width: 162,
        height: 36,
        marginBottom: theme.spacing(2)
      },
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        paddingTop: theme.spacing(1),
        flexDirection: 'row',
        '& button': {
          marginRight: theme.spacing(2),
          marginBottom: 0
        }
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        '& button': {
          marginRight: theme.spacing(2),
          marginBottom: 0
        }
      }
    },
    inputBox: {
      ...inputBox,
      [theme.breakpoints.up('md')]: {
        width: 800
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: theme.spacing(0),
        paddingBottom: theme.spacing(1)
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
    loading: {
      ...loading,
      [theme.breakpoints.up('md')]: {
        minWidth: 800
      }
    },
    helpIcon,
    message,
    rocketSvg
  }
})

const LiquidityBackLayer = ({
  onReload,
  ual,
  isLightMode,
  showMessage,
  getTourSteps
}) => {
  const classes = useStyles()
  const { t } = useTranslation('liquidity')
  const [{ pairs, currentPair }] = useExchange()
  const [pair, setPair] = useState()
  const [toBuy, setToBuy] = useState()
  const [toSell, setToSell] = useState()
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [youGive, setYouGive] = useState({})
  const [loading, setLoading] = useState(false)

  const handleOnChange = (value) => {
    showMessage(null)
    setYouGive(value)
  }

  const handleOnAddLiquidity = async () => {
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

    if (!youGive.inputValue) {
      showMessage({
        type: 'warning',
        content: t('noAmount')
      })
      return
    }

    setLoading(true)

    try {
      const { transactionId } = await evolutiondex.addLiquidity(
        youGive.inputValue,
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

  const handleOnRemoveLiquidity = async () => {
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

    if (!youGive.inputValue) {
      showMessage({
        type: 'warning',
        content: t('noAmountRemove')
      })
      return
    }

    setLoading(true)

    try {
      const { transactionId } = await evolutiondex.removeLiquidity(
        youGive.inputValue,
        pair,
        ual
      )
      showMessage((prevState) => ({
        ...prevState,
        type: 'success',
        content: (
          <span>
            {`${t('successTransaction')}: `}
            <Link
              href={`${ualConfig.blockExplorerUrl}/transaction/${transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionId}
            </Link>
          </span>
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
    setPair(pairs.find((pair) => pair.token === youGive.selectValue))
  }, [pairs, youGive.selectValue])

  useEffect(() => {
    if (!pair || !youGive.inputValue) {
      setToBuy(null)
      setToSell(null)

      return
    }

    setToBuy(evolutiondex.getAddLiquidityAssets(youGive.inputValue, pair))
    setToSell(evolutiondex.getRemoveLiquidityAssets(youGive.inputValue, pair))
  }, [pair, youGive.inputValue])

  useEffect(() => {
    if (!currentPair) {
      return
    }

    setYouGive((prevValue) => ({
      ...prevValue,
      selectValue: currentPair.token
    }))
  }, [showMessage, currentPair])

  return (
    <Box className={classes.liquidityRoot}>
      <TitlePage title={t('htmlTitle')} />
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
            id="liquidityYouGive"
            containerId="youGive"
            label={t('inputLabel')}
            helperText={
              pair
                ? `${pair.balance ? pair.balance.toString() : 0} ${t(
                    'available'
                  )}`
                : ''
            }
            onChange={handleOnChange}
            value={youGive}
          />
        </Box>
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>{`${t('add')}: `}</strong>
              {toBuy && (
                <span>
                  {`${toBuy.asset1.toString()} ${t(
                    'and'
                  )} ${toBuy.asset2.toString()}`}
                </span>
              )}
            </Typography>
            <Typography variant="body1">
              <strong>{`${t('fee')}:`}</strong> {Number(pair.fee) / 100}%
            </Typography>
          </Box>
        )}
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>{`${t('remove')}: `}</strong>
              {toSell && (
                <span>
                  {`${toSell.asset1.toString()} ${t(
                    'and'
                  )} ${toSell.asset2.toString()}`}
                </span>
              )}
            </Typography>
            <Typography variant="body1">
              <strong>{`${t('fee')}:`}</strong> 0%
            </Typography>
          </Box>
        )}
        {loading && (
          <LinearProgress className={classes.loading} color="secondary" />
        )}
        <Box className={classes.btnExchange}>
          <Button
            onClick={handleOnAddLiquidity}
            isLightMode={isLightMode}
            variant="contained"
            startIcon={<AddIcon />}
          >
            {t('add').toLocaleUpperCase()}
          </Button>
          <Button
            onClick={handleOnRemoveLiquidity}
            isLightMode={isLightMode}
            variant="contained"
            startIcon={<RemoveIcon />}
          >
            {t('remove').toLocaleUpperCase()}
          </Button>

          <HelpIcon
            className={classes.helpIcon}
            onClick={() => setIsTourOpen(true)}
          />
        </Box>
      </Box>
      <TourGuide
        isTourOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
        stepsByPage="liquidity"
      />
    </Box>
  )
}

LiquidityBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func,
  getTourSteps: PropTypes.func
}

export default LiquidityBackLayer
