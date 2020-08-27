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
import TitlePage from 'components/PageTitle'
import InputTextAndSelect from 'components/InputTextAndSelect'
import EvodexRocketSvg from 'components/Icons/EvodexRocket'
import Button from 'components/Button'
import { useExchange } from 'context/exchange.context'
import { evolutiondex } from 'utils'

const useStyles = makeStyles((theme) => ({
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
      padding: theme.spacing(3, 0)
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    padding: theme.spacing(2, 0),
    '& svg': {
      color: '#fff',
      fontSize: 30,
      margin: theme.spacing(3, 0)
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(0),
      padding: theme.spacing(0),
      alignItems: 'start',
      '& > .MuiBox-root': {
        marginTop: theme.spacing(2)
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
    display: 'flex',
    fontSize: 12,
    marginLeft: theme.spacing(1)
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
  },
  btnExchange: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    '& button': {
      width: 162,
      height: 36
    },
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
    },
    [theme.breakpoints.up('lg')]: {
      paddingTop: theme.spacing(2)
    }
  },
  message: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
    minWidth: '100%'
  },
  loading: {
    marginTop: theme.spacing(2),
    minWidth: '100%'
  }
}))

const ExchangeBackLayer = ({ onReload, ual, isLightMode, showMessage }) => {
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
  const [youGive, setYouGive] = useState({ walletBalance: {} })
  const [loading, setLoading] = useState(false)
  const [helperTextReceive, setHelperTextReceive] = useState('')

  const getTokenValue = (token) => {
    let result = ''

    if (token === pair.pool1.asset.symbol.code().toString().toUpperCase()) {
      result = `Pool: ${
        pair.pool1.asset.toString().split(' ')[0]
      } (${pair.pool1.asset.symbol.code().toString().toLowerCase()}.token)`
    } else {
      result = `Pool: ${
        pair.pool2.asset.toString().split(' ')[0]
      } (${pair.pool2.asset.symbol.code().toString().toLowerCase()}.token)`
    }

    setHelperTextReceive(result)
  }

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
  }

  const handleOnSwitchValues = () => {
    setYouReceive({
      selectValue: youGive.selectValue
    })
    getTokenValue(youGive.selectValue)
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
  }, [pair, youGive.inputValue])

  useEffect(() => {
    if (!exchangeState.currentPair) {
      return
    }

    setHelperTextReceive(
      `Pool: ${
        exchangeState.currentPair.pool2.asset.toString().split(' ')[0]
      } (${exchangeState.currentPair.pool2.asset.symbol
        .code()
        .toString()
        .toLowerCase()}.token)`
    )

    setYouGive((prevValue) => ({
      ...prevValue,
      selectValue: exchangeState.currentPair.pool1.asset.symbol
        .code()
        .toString()
    }))
    setYouReceive((prevValue) => ({
      ...prevValue,
      selectValue: exchangeState.currentPair.pool2.asset.symbol
        .code()
        .toString()
    }))
  }, [showMessage, exchangeState.currentPair, ual.activeUser])

  useEffect(() => {
    const getCurrencyBalance = async () => {
      let walletPool = {}

      if (ual.activeUser) {
        const pool1 = await ual.activeUser.rpc.get_currency_balance(
          'eosio.token',
          ual.activeUser.accountName,
          pair.pool1.asset.symbol.code().toString()
        )

        const pool2 = await ual.activeUser.rpc.get_currency_balance(
          'eosio.token',
          ual.activeUser.accountName,
          pair.pool2.asset.symbol.code().toString()
        )

        walletPool = {
          [pair.pool1.asset.symbol.code().toString()]: pool1.length
            ? pool1[0]
            : `0 ${pair.pool1.asset.symbol.code().toString()}`,
          [pair.pool2.asset.symbol.code().toString()]: pool2.length
            ? pool2[0]
            : `0 ${pair.pool2.asset.symbol.code().toString()}`
        }
      }

      setYouGive((prevValue) => ({
        ...prevValue,
        walletBalance: walletPool
      }))
      getTokenValue(youReceive.selectValue)
    }

    if (!pair) {
      return
    }

    getCurrencyBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair])

  return (
    <Box className={classes.exchangeRoot}>
      <TitlePage title={t('htmlTitle')} />
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">{t('title')}</Typography>
        <Typography variant="body1">{t('description')}</Typography>
      </Box>
      <Box className={classes.inputBox}>
        <InputTextAndSelect
          id="exchangeYouGive"
          label={t('youGive')}
          options={options.youGive}
          onChange={handleOnChange('youGive')}
          value={youGive}
          helperText={
            pair &&
            ual.activeUser && (
              <Typography
                variant="body1"
                className={clsx([classes.textInfo, classes.helperText])}
              >
                {`Your Wallet: ${youGive.walletBalance[youGive.selectValue]}`}
              </Typography>
            )
          }
          useHelperTextAsNode
        />
        <IconButton aria-label="switch" onClick={handleOnSwitchValues}>
          {isDesktop ? <SwapHorizIcon /> : <ImportExportIcon />}
        </IconButton>
        <InputTextAndSelect
          id="exchangeYouReceive"
          label={t('youReceive')}
          options={options.youReceive}
          onChange={handleOnChange('youReceive')}
          value={youReceive}
          inputDisabled
          helperText={
            pair && (
              <Typography
                variant="body1"
                className={clsx([classes.textInfo, classes.helperText])}
              >
                {helperTextReceive}
              </Typography>
            )
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
      </Box>
    </Box>
  )
}

ExchangeBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func
}

export default ExchangeBackLayer
