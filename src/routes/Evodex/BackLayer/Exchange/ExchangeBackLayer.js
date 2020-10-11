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
  const [switchValues, setSwitchValues] = useState(false)
  const [stopCallback, setStopCallback] = useState(false)
  const [userBalance, setUserBalance] = useState({})

  const handleOnSetData = (
    getExchangeAssets,
    value,
    assetTo,
    mainField,
    secondField
  ) => {
    const lastCharacter =
      value.inputValue && value.inputValue.charAt(value.inputValue.length - 1)

    if (lastCharacter !== '.' && pair && value.inputValue) {
      const assets = getExchangeAssets(value.inputValue, pair)

      setAssets(assets)
      setStopCallback(true)
      setInputsData((prevState) => ({
        [mainField]: { ...prevState[mainField], ...value },
        [secondField]: {
          ...prevState[secondField],
          inputValue: assets[assetTo].toString().split(' ')[0]
        }
      }))
    } else {
      setInputsData((prevState) => ({
        ...prevState,
        [mainField]: { ...prevState[mainField], ...value }
      }))
    }
  }

  console.log('current value:', stopCallback)

  const handleOnChange = (key) => (value) => {
    if (stopCallback && value.inputValue === inputsData[key].inputValue) {
      setStopCallback(false)

      return
    }

    switch (key) {
      case 'youGive': {
        handleOnSetData(
          evolutiondex.getExchangeAssets,
          value,
          'assetToReceive',
          key,
          'youReceive'
        )

        break
      }
      case 'youReceive': {
        handleOnSetData(
          evolutiondex.getExchangeAssetsFromToken2,
          value,
          'assetToGive',
          key,
          'youGive'
        )

        break
      }
      default:
        break
    }
  }

  const handleIsValueAllowed = ({ floatValue, value }) => {
    if (value === '-' || floatValue < 0 || value === '.') return false

    if (!floatValue) return true

    return floatValue < EXCHANGE_MAX_VALUE
  }

  const handleOnSwitchValues = () => {
    if (!pair) return

    setSwitchValues(true)
    setInputsData({
      youGive: inputsData.youReceive,
      youReceive: inputsData.youGive
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

    getCurrencyBalance(pair)

    if (switchValues) {
      setInputsData({
        youGive: inputsData.youGive,
        youReceive: inputsData.youReceive
      })

      setSwitchValues(false)
    } else {
      setInputsData({
        youGive: {
          ...inputsData.youGive,
          inputValue: ''
        },
        youReceive: {
          ...inputsData.youReceive,
          inputValue: ''
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair])

  useEffect(() => {
    if (!exchangeState.currentPair) return
    const youGiveValueSelected = exchangeState.currentPair.pool1.asset.symbol
      .code()
      .toString()
    const youReceiveValueSelected = exchangeState.currentPair.pool2.asset.symbol
      .code()
      .toString()

    setPair(exchangeState.currentPair)
    setInputsData({
      youGive: {
        inputValue: '',
        selectValue: youGiveValueSelected
      },
      youReceive: {
        inputValue: '',
        selectValue: youReceiveValueSelected
      }
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
          value={inputsData.youGive}
          helperText={
            <>
              {pair && userBalance[inputsData.youGive.selectValue] && (
                <Typography
                  variant="body1"
                  className={clsx([classes.textInfo, classes.helperText])}
                >
                  <span>{t('pool')}: </span>
                  {userBalance[inputsData.youGive.selectValue].poolAsset}
                  <Link
                    className={classes.poolContractLink}
                    href={`${ualConfig.blockExplorerUrl}/account/${
                      userBalance[inputsData.youGive.selectValue].contract
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ({userBalance[inputsData.youGive.selectValue].contract})
                  </Link>
                </Typography>
              )}
              {ual.activeUser && (
                <Typography
                  variant="body1"
                  className={clsx([classes.textInfo, classes.helperText])}
                >
                  {pair && <span>{t('yourWallet')}: </span>}
                  {userBalance[inputsData.youGive.selectValue] && (
                    <span>
                      {userBalance[inputsData.youGive.selectValue].userAsset}
                    </span>
                  )}
                </Typography>
              )}
            </>
          }
          useHelperTextAsNode
          hasError={
            userBalance[inputsData.youGive.selectValue]
              ? userBalance[inputsData.youGive.selectValue].amount <
                parseFloat(inputsData.youGive.inputValue || 0)
              : false
          }
          decimalScale={18}
          isValueAllowed={handleIsValueAllowed}
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
          value={inputsData.youReceive}
          helperText={
            <Typography
              variant="body1"
              className={clsx([classes.textInfo, classes.helperText])}
            >
              {pair && <span>{t('pool')}: </span>}
              {userBalance[inputsData.youReceive.selectValue] && (
                <>
                  <span>
                    {userBalance[inputsData.youReceive.selectValue].poolAsset}
                  </span>
                  <Link
                    className={classes.poolContractLink}
                    href={`${ualConfig.blockExplorerUrl}/account/${
                      userBalance[inputsData.youReceive.selectValue].contract
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ({userBalance[inputsData.youReceive.selectValue].contract})
                  </Link>
                </>
              )}
            </Typography>
          }
          useHelperTextAsNode
          decimalScale={18}
          isValueAllowed={handleIsValueAllowed}
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
  showMessage: PropTypes.func
}

export default ExchangeBackLayer
