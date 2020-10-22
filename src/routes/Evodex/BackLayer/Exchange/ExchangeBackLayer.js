import React, { memo, useEffect, useState } from 'react'
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

import { ualConfig } from 'config'
import TourGuide from 'components/TourGuide'
import InputTextAndSelect from 'components/InputTextAndSelect'
import EvodexRocketSvg from 'components/Icons/EvodexRocket'
import MessageLink from 'components/MessageLink'
import Button from 'components/Button'
import { useExchange } from 'context/exchange.context'
import { evolutiondex, commonStyles } from 'utils'

import HelpeText from './HelpeText'

const EXCHANGE_MAX_VALUE = Math.pow(2, 62)

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
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'start'
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
      maxWidth: 500,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textWrapper: {
      minWidth: 260,
      display: 'flex',
      justifyContent: 'space-between',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      flex: 1
    },
    textInfo: {
      fontSize: 16.2,
      fontWeight: 500,
      letterSpacing: '0.5px',
      lineHeight: 1.73,
      color: '#fff'
    },
    textBold: {
      fontWeight: 'bold'
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
    error: {
      color: theme.palette.error.main
    },
    warning: {
      color: theme.palette.warning.main
    },
    success: {
      color: theme.palette.success.main
    },
    helpText,
    message,
    loading,
    rocketSvg
  }
})

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
  const [inputsData, setInputsData] = useState({ youGive: {}, youReceive: {} })
  const [loading, setLoading] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [balance, setBalance] = useState({})
  const [inputError, setInputError] = useState({})
  const validInput = RegExp('^([0-9]+([.][0-9]*)?|[.][0-9]+)$')

  const isValueAllowed = (key) => (value) => {
    if (!value) {
      return true
    }

    if (!validInput.test(value)) {
      return false
    }

    const [, floatSection = ''] = value.split('.')

    if (pair && floatSection.length > pair[key].asset.symbol.precision()) {
      return false
    }

    const floatValue = parseFloat(value)

    return floatValue < EXCHANGE_MAX_VALUE
  }

  const calculateNewInputValues = (
    getExchangeAssets,
    value,
    assetTo,
    mainField,
    secondField,
    validate
  ) => {
    if (!pair) {
      setInputsData((prevState) => ({
        ...prevState,
        [mainField]: value
      }))

      return
    }

    if (!value.inputValue) {
      setInputsData((prevState) => ({
        ...prevState,
        [mainField]: value,
        [secondField]: {
          ...prevState[secondField],
          inputValue: ''
        }
      }))

      return
    }

    try {
      const assets = getExchangeAssets(value.inputValue, pair)
      setAssets(assets)
      setInputsData((prevState) => {
        const data = {
          ...prevState[secondField],
          inputValue: assets[assetTo].toString().split(' ')[0]
        }
        validate(data)

        return {
          [mainField]: {
            ...prevState[mainField],
            ...value
          },
          [secondField]: data
        }
      })
    } catch (error) {
      // TODO: improve error handler
      console.log(error.message)
      setInputsData((prevState) => ({
        ...prevState,
        [mainField]: value,
        [secondField]: {
          ...prevState[secondField],
          inputValue: ''
        }
      }))
      setInputError((prev) => ({ ...prev, [mainField]: 'errorNumberIsTooBig' }))
    }
  }

  const validateYouGive = (value) => {
    const tokenBalance = balance[value.selectValue]
    let errorMessage = ''

    if (
      tokenBalance &&
      typeof tokenBalance.userAmount !== 'undefined' &&
      tokenBalance.userAmount < parseFloat(value.inputValue || 0)
    ) {
      errorMessage = 'valueOverWalletBalance'
    }

    setInputError((prev) => ({ ...prev, youGive: errorMessage }))
  }

  const validateYouReceive = (value) => {
    if (!pair || !balance || !value.inputValue) {
      setInputError((prev) => ({
        ...prev,
        youReceive: ''
      }))

      return true
    }

    const tokenBalance = balance[value.selectValue]
    const tokenPrecision = Math.pow(10, pair.to.asset.symbol.precision())
    const fee = tokenBalance?.poolAmount * (pair.fee / 10000)
    const maxValue =
      Math.floor((tokenBalance?.poolAmount - fee) * tokenPrecision) /
      tokenPrecision

    if (isNaN(maxValue) || parseFloat(value.inputValue) < maxValue) {
      setInputError((prev) => ({
        ...prev,
        youReceive: ''
      }))

      return true
    }

    setInputsData((prevState) => ({
      youReceive: {
        ...prevState.youReceive,
        ...value
      },
      youGive: {
        ...prevState.youGive,
        inputValue: ''
      }
    }))
    setInputError({
      youGive: '',
      youReceive: 'valueOverPoolBalance'
    })

    return false
  }

  const handleOnChange = (key) => (value) => {
    setAssets(null)
    setInputError((prev) => ({ ...prev, youGive: '', youReceive: '' }))

    switch (key) {
      case 'youGive': {
        validateYouGive(value)
        calculateNewInputValues(
          evolutiondex.getExchangeAssets,
          value,
          'assetToReceive',
          key,
          'youReceive',
          validateYouReceive
        )

        break
      }
      case 'youReceive': {
        validateYouReceive(value) &&
          calculateNewInputValues(
            evolutiondex.getExchangeAssetsFromToken2,
            value,
            'assetToGive',
            key,
            'youGive',
            validateYouGive
          )

        break
      }
      default:
        break
    }
  }

  const handleOnSwitchValues = () => {
    setInputsData({
      youGive: {
        ...inputsData.youGive,
        selectValue: inputsData.youReceive.selectValue
      },
      youReceive: {
        ...inputsData.youReceive,
        selectValue: inputsData.youGive.selectValue
      }
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

    if (!inputsData.youGive.inputValue) {
      showMessage({
        type: 'warning',
        content: t('noAmount')
      })
      return
    }

    setLoading(true)

    try {
      const { transactionId } = await evolutiondex.exchange(
        inputsData.youGive.inputValue,
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

  const getClassForPriceImpact = (priceImpact) => {
    switch (true) {
      case priceImpact < 1:
        return classes.success
      case priceImpact > 2 && priceImpact < 5:
        return classes.warning
      case priceImpact >= 5:
        return classes.error
      default:
        return ''
    }
  }

  useEffect(() => {
    if (!exchangeState.currentPair) return

    const youGiveValueSelected = exchangeState.currentPair.pool1.asset.symbol
      .code()
      .toString()
    const youReceiveValueSelected = exchangeState.currentPair.pool2.asset.symbol
      .code()
      .toString()

    setInputsData({
      youGive: {
        ...inputsData.youGive,
        selectValue: youGiveValueSelected
      },
      youReceive: {
        ...inputsData.youReceive,
        selectValue: youReceiveValueSelected
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeState.currentPair])

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      youGive: evolutiondex
        .getTokensFor(inputsData.youReceive.selectValue, exchangeState)
        .map((token) => ({ label: token, value: token })),
      youReceive: evolutiondex
        .getTokensFor(inputsData.youGive.selectValue, exchangeState)
        .map((token) => ({ label: token, value: token }))
    }))

    setPair(
      evolutiondex.getPair(
        inputsData.youGive.selectValue,
        inputsData.youReceive.selectValue,
        exchangeState
      )
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    exchangeState.pairs,
    exchangeState.tokens,
    inputsData.youGive.selectValue,
    inputsData.youReceive.selectValue
  ])

  useEffect(() => {
    if (!pair) return

    const getBalance = async () => {
      const poolAsset1 = pair.pool1.asset.toString()
      const poolAsset2 = pair.pool2.asset.toString()
      let balance = {
        [pair.pool1.asset.symbol.code().toString()]: {
          contract: pair.pool1.contract,
          token: pair.pool1.asset.symbol.code().toString(),
          poolAsset: poolAsset1,
          poolAmount: parseFloat(poolAsset1.split(' ')[0] || 0)
        },
        [pair.pool2.asset.symbol.code().toString()]: {
          contract: pair.pool2.contract,
          token: pair.pool2.asset.symbol.code().toString(),
          poolAsset: poolAsset2,
          poolAmount: parseFloat(poolAsset2.split(' ')[0] || 0)
        }
      }

      if (!ual.activeUser) {
        setBalance(balance)

        return
      }

      try {
        const pool1 =
          (await evolutiondex.getUserTokenBalance(ual, pair.pool1)) ||
          `0 ${pair.pool1.asset.symbol.code().toString()}`
        const pool2 =
          (await evolutiondex.getUserTokenBalance(ual, pair.pool2)) ||
          `0 ${pair.pool2.asset.symbol.code().toString()}`
        balance = {
          [pair.pool1.asset.symbol.code().toString()]: {
            ...balance[pair.pool1.asset.symbol.code().toString()],
            userAsset: pool1,
            userAmount: parseFloat(pool1.split(' ')[0] || 0)
          },
          [pair.pool2.asset.symbol.code().toString()]: {
            ...balance[pair.pool2.asset.symbol.code().toString()],
            userAsset: pool2,
            userAmount: parseFloat(pool2.split(' ')[0] || 0)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
      setBalance(balance)
    }

    getBalance()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair])

  useEffect(() => {
    if (inputsData.youGive.inputValue) {
      handleOnChange('youGive')(inputsData.youGive)
    } else if (inputsData.youReceive.inputValue) {
      handleOnChange('youReceive')(inputsData.youReceive)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance])

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
          value={inputsData.youGive}
          useHelperTextAsNode
          hasError={!!inputError.youGive}
          isValueAllowed={isValueAllowed('from')}
          onChange={handleOnChange('youGive')}
          helperText={
            <HelpeText
              activeUser={!!ual.activeUser}
              balance={balance}
              inputsData={inputsData}
              inputsError={inputError}
              name="youGive"
            />
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
          value={inputsData.youReceive}
          useHelperTextAsNode
          hasError={!!inputError.youReceive}
          isValueAllowed={isValueAllowed('to')}
          onChange={handleOnChange('youReceive')}
          helperText={
            <HelpeText
              activeUser={!!ual.activeUser}
              balance={balance}
              inputsData={inputsData}
              inputsError={inputError}
              name="youReceive"
            />
          }
        />
      </Box>
      <Box className={classes.infoBox}>
        <Box className={classes.infoBoxWrapper}>
          {assets?.rate && (
            <Box className={classes.textWrapper}>
              <Typography
                variant="body1"
                className={clsx(classes.textInfo, classes.textBold)}
              >
                {`${t('rate')}: `}
              </Typography>
              <Typography variant="body1" className={classes.textInfo}>
                {assets.rate}
              </Typography>
            </Box>
          )}
          {pair?.fee && (
            <Box className={classes.textWrapper}>
              <Typography
                variant="body1"
                className={clsx(classes.textInfo, classes.textBold)}
              >
                {`${t('fee')}: `}
              </Typography>
              <Typography variant="body1" className={classes.textInfo}>
                {Number(pair.fee) / 100}%
              </Typography>
            </Box>
          )}
          {assets?.priceImpact >= 0 && (
            <Box className={classes.textWrapper}>
              <Typography
                variant="body1"
                className={clsx(classes.textInfo, classes.textBold)}
              >
                {`${t('priceImpact')}: `}
              </Typography>
              <Typography
                variant="body1"
                className={clsx(
                  classes.textInfo,
                  getClassForPriceImpact(assets?.priceImpact)
                )}
              >
                {assets.priceImpact}%
              </Typography>
            </Box>
          )}
        </Box>
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
  showMessage: PropTypes.func
}

export default memo(ExchangeBackLayer)
