import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { makeStyles, useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'

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
    inputBox,
    rocketSvg,
    btnExchange,
    titleBox,
    message,
    loading,
    helpText
  } = commonStyles(theme)

  return {
    exchangeRoot: {
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
        padding: theme.spacing(4, 0)
      }
    },
    titleBox: {
      ...titleBox,
      '& p': {
        fontSize: 16.2,
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
    inputBox: {
      ...inputBox,
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: theme.spacing(0),
        padding: theme.spacing(0),
        alignItems: 'start',
        '& > .MuiBox-root': {
          marginTop: theme.spacing(1)
        }
      }
    },
    infoBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexFlow: 'column'
    },
    infoBoxWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    feeSpace: {
      marginLeft: theme.spacing(2)
    },
    textInfo: {
      fontSize: 16.2,
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.73,
      color: '#fff'
    },
    textWithDescription: {
      display: 'flex',
      justifyContent: 'space-between',
      '& span': {
        color: 'rgba(255, 255, 255, 0.6)'
      }
    },
    helperText: {
      fontSize: 12,
      marginLeft: theme.spacing(1),
      minHeight: 20
    },
    btnExchange: {
      ...btnExchange,
      alignItems: 'center',
      flexDirection: 'column',
      [theme.breakpoints.up('sm')]: {
        '& button': {
          width: 266
        }
      },
      [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
        paddingTop: theme.spacing(1)
      },
      [theme.breakpoints.up('md')]: {
        '& button': {
          width: 300
        }
      }
    },
    poolContractLink: {
      color: theme.palette.primary.contrastText,
      textDecoration: 'none',
      marginLeft: theme.spacing(1)
    },
    helpText,
    message,
    loading,
    rocketSvg
  }
})

const ExchangeBackLayer = ({
  onReload,
  ual,
  isLightMode,
  showMessage,
  getTourSteps
}) => {
  const { t } = useTranslation('exchange')
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })
  const [exchangeState] = useExchange()
  const [pair, setPair] = useState()
  const [assets, setAssets] = useState()
  const [options, setOptions] = useState({ youGive: [], youReceive: [] })
  const [youReceive, setYouReceive] = useState({})
  const [youGive, setYouGive] = useState({})
  const [loading, setLoading] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [userChangeInput, setUserChangeInput] = useState('')
  const [userBalance, setUserBalance] = useState({})
  const [, setLastInterval] = useState('')

  const handleOnChange = (key) => (value) => {
    let set

    switch (key) {
      case 'youGive':
        set = setYouGive
        break
      case 'youReceive':
        set = setYouReceive
        break
      default:
        set = () => {}
    }

    set((prevState) => ({
      ...prevState,
      ...value
    }))
    setUserChangeInput(key)
  }

  const handleOnSwitchValues = () => {
    setYouReceive({
      selectValue: youGive.selectValue
    })
    setYouGive({
      ...youGive,
      selectValue: youReceive.selectValue
    })
  }

  const handleOnExchange = async () => {
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
      const { transactionId } = await evolutiondex.exchange(
        youGive.inputValue,
        pair,
        ual
      )
      showMessage({
        type: 'success',
        content: (
          <MessageLink
            text={`${t('successTransaction')}: `}
            href={`${ualConfig.blockExplorerUrl}/transaction/${transactionId}`}
            transactionId={transactionId}
          />
        )
      })
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

  const getCurrencyBalance = async (pairToken) => {
    let userbalance = {
      [pairToken.pool1.asset.symbol.code().toString()]: {
        poolAsset: pairToken.pool1.asset.toString(),
        token: pairToken.pool1.asset.symbol.code().toString(),
        contract: pairToken.pool1.contract
      },
      [pairToken.pool2.asset.symbol.code().toString()]: {
        poolAsset: pairToken.pool2.asset.toString(),
        token: pairToken.pool2.asset.symbol.code().toString(),
        contract: pairToken.pool2.contract
      }
    }

    if (ual.activeUser) {
      const pool1 =
        (await evolutiondex.getUserTokenBalance(ual, pairToken.pool1)) ||
        `0 ${pairToken.pool1.asset.symbol.code().toString()}`
      const pool2 =
        (await evolutiondex.getUserTokenBalance(ual, pairToken.pool2)) ||
        `0 ${pairToken.pool2.asset.symbol.code().toString()}`

      userbalance = {
        [pairToken.pool1.asset.symbol.code().toString()]: {
          ...userbalance[pairToken.pool1.asset.symbol.code().toString()],
          amount: parseFloat(pool1.split(' ')[0] || 0),
          userAsset: pool1
        },
        [pairToken.pool2.asset.symbol.code().toString()]: {
          ...userbalance[pairToken.pool2.asset.symbol.code().toString()],
          amount: parseFloat(pool2.split(' ')[0] || 0),
          userAsset: pool2
        }
      }
    }

    setUserBalance(userbalance)
  }

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      youGive: evolutiondex
        .getTokensFor(youReceive.selectValue, exchangeState)
        .map((token) => ({ label: token, value: token })),
      youReceive: evolutiondex
        .getTokensFor(youGive.selectValue, exchangeState)
        .map((token) => ({ label: token, value: token }))
    }))
    setPair(
      evolutiondex.getPair(
        youGive.selectValue,
        youReceive.selectValue,
        exchangeState
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exchangeState.pairs,
    exchangeState.tokens,
    youGive.selectValue,
    youReceive.selectValue
  ])

  useEffect(() => {
    if (userChangeInput !== 'youGive') {
      return
    }

    if (!pair || !youGive.inputValue) {
      setYouReceive((prevState) => ({
        ...prevState,
        inputValue: ''
      }))
      setAssets(null)

      return
    }

    const assets = evolutiondex.getExchangeAssets(youGive.inputValue, pair)
    setAssets(assets)
    setYouReceive((prevState) => ({
      ...prevState,
      inputValue: assets.assetToReceive.toString().split(' ')[0]
    }))
  }, [userChangeInput, pair, youGive.inputValue])

  useEffect(() => {
    if (userChangeInput !== 'youReceive') {
      return
    }

    setLastInterval((lastValue) => {
      clearInterval(lastValue)

      return null
    })

    if (!pair || !youReceive.inputValue) {
      setYouGive((prevState) => ({
        ...prevState,
        inputValue: ''
      }))
      setAssets(null)

      return
    }

    const assets = evolutiondex.getExchangeAssetsFromToken2(
      youReceive.inputValue,
      pair
    )

    setAssets(assets)
    setYouGive((prevState) => ({
      ...prevState,
      inputValue: assets.assetToGive.toString().split(' ')[0]
    }))
    setLastInterval(
      setTimeout(() => {
        setUserChangeInput('youGive')
      }, 2000)
    )
  }, [userChangeInput, pair, youReceive.inputValue])

  useEffect(() => {
    if (!pair) return

    getCurrencyBalance(pair)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair])

  useEffect(() => {
    if (!exchangeState.currentPair) return

    setPair(exchangeState.currentPair)
    setYouGive({
      ...youGive,
      selectValue: exchangeState.currentPair.pool1.asset.symbol
        .code()
        .toString()
    })
    setYouReceive({
      ...youReceive,
      selectValue: exchangeState.currentPair.pool2.asset.symbol
        .code()
        .toString()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeState.currentPair])

  return (
    <Box className={classes.exchangeRoot}>
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">{t('title')}</Typography>
        <Typography variant="body1">{t('description')}</Typography>
      </Box>
      <Box className={classes.inputBox}>
        <InputTextAndSelect
          id="exchangeYouGive"
          containerId="youGive"
          label={t('youGive')}
          options={options.youGive}
          onChange={handleOnChange('youGive')}
          value={youGive}
          helperText={
            <>
              {pair && userBalance[youGive.selectValue] && (
                <Typography
                  variant="body1"
                  className={clsx([classes.textInfo, classes.helperText])}
                >
                  <span>{t('pool')}: </span>
                  {userBalance[youGive.selectValue].poolAsset}
                  <Link
                    className={classes.poolContractLink}
                    href={`${ualConfig.blockExplorerUrl}/account/${
                      userBalance[youGive.selectValue].contract
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ({userBalance[youGive.selectValue].contract})
                  </Link>
                </Typography>
              )}
              {ual.activeUser && (
                <Typography
                  variant="body1"
                  className={clsx([classes.textInfo, classes.helperText])}
                >
                  {pair && <span>{t('yourWallet')}: </span>}
                  {userBalance[youGive.selectValue] && (
                    <span>{userBalance[youGive.selectValue].userAsset}</span>
                  )}
                </Typography>
              )}
            </>
          }
          useHelperTextAsNode
          hasError={
            userBalance[youGive.selectValue]
              ? userBalance[youGive.selectValue].amount <
                parseFloat(youGive.inputValue || 0)
              : false
          }
        />
        <IconButton aria-label="switch" onClick={handleOnSwitchValues}>
          {isDesktop ? <SwapHorizIcon /> : <ImportExportIcon />}
        </IconButton>
        <InputTextAndSelect
          id="exchangeYouReceive"
          containerId="youReceive"
          label={t('youReceive')}
          options={options.youReceive}
          onChange={handleOnChange('youReceive')}
          value={youReceive}
          helperText={
            <Typography
              variant="body1"
              className={clsx([classes.textInfo, classes.helperText])}
            >
              {pair && <span>{t('pool')}: </span>}
              {userBalance[youReceive.selectValue] && (
                <>
                  <span>{userBalance[youReceive.selectValue].poolAsset}</span>
                  <Link
                    className={classes.poolContractLink}
                    href={`${ualConfig.blockExplorerUrl}/account/${
                      userBalance[youReceive.selectValue].contract
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ({userBalance[youReceive.selectValue].contract})
                  </Link>
                </>
              )}
            </Typography>
          }
          useHelperTextAsNode
        />
      </Box>
      <Box className={classes.infoBoxWrapper}>
        <Typography variant="body1" className={classes.textInfo}>
          <strong>{`${t('price')}: `}</strong>
          {assets ? <span>{assets.price}</span> : 0}
        </Typography>
        <Typography
          variant="body1"
          className={clsx(classes.textInfo, classes.feeSpace)}
        >
          <strong>{`${t('fee')}:`}</strong> {pair ? Number(pair.fee) / 100 : 0}%
        </Typography>
      </Box>
      {loading && (
        <LinearProgress className={classes.loading} color="secondary" />
      )}
      <Box className={classes.btnExchange}>
        <Button
          variant="contained"
          isLightMode={isLightMode}
          onClick={handleOnExchange}
        >
          {t('btnLabel').toLocaleUpperCase()}
        </Button>
        <Typography
          onClick={() => setIsTourOpen(true)}
          variant="body1"
          className={classes.helpText}
        >
          {t('help').toUpperCase()}
        </Typography>
      </Box>
      <TourGuide
        isTourOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
        stepsByPage="exchange"
      />
    </Box>
  )
}

ExchangeBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func,
  getTourSteps: PropTypes.func
}

export default ExchangeBackLayer
