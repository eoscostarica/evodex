import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'

import { ualConfig } from '../../../config'
import InputTextAndSelect from '../../../components/InputTextAndSelect'
import EvodexRocketSvg from '../../../components/Icons/EvodexRocket'
import Button from '../../../components/Button'
import { useExchange } from '../../../context/exchange.context'
import { evolutiondex } from '../../../utils'

const useStyles = makeStyles((theme) => ({
  exchangeRoot: {
    marginTop: theme.spacing(7),
    padding: theme.spacing(3, 1, 0, 1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(13),
      paddingRight: theme.spacing(32),
      paddingLeft: theme.spacing(32)
    }
  },
  titleBox: {
    width: 225,
    paddingLeft: theme.spacing(2),
    '& h4': {
      fontSize: 33,
      letterSpacing: '-0.49px',
      color: '#ffffff'
    },
    '& p': {
      fontSize: 16.2,
      fontWeight: 500,
      letterSpacing: '0.2px',
      color: 'rgba(255, 255, 255, 0.6)'
    },
    [theme.breakpoints.up('sm')]: {
      width: '70%',
      '& p': {
        fontSize: 20.2,
        fontWeight: 600,
        letterSpacing: '0.25px'
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
      justifyContent: 'space-evenly'
    }
  },
  rocketSvg: {
    zIndex: 0,
    position: 'absolute',
    height: 260,
    right: '0px',
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

const ExchangeBackLayer = ({ onReload, ual, isLightMode }) => {
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
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)

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

    setMessage(null)
    set((prevState) => ({
      ...prevState,
      ...value
    }))
  }

  const handleOnSwitchValues = () => {
    setMessage(null)
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
      setMessage({ type: 'warning', text: 'Please login to continue' })
      return
    }

    if (!pair) {
      setMessage({
        type: 'warning',
        text: 'Please select both tokens to continue'
      })
      return
    }

    if (!youGive.inputValue) {
      setMessage({
        type: 'warning',
        text: 'Please enter the amount to give to continue'
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { transactionId } = await evolutiondex.exchange(
        youGive.inputValue,
        pair,
        ual
      )
      setMessage((prevState) => ({
        ...prevState,
        type: 'success',
        text: (
          <span>
            Success transaction:{' '}
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
      setMessage((prevState) => ({
        ...prevState,
        type: 'error',
        text: error.message
      }))
      setTimeout(() => {
        setMessage(null)
      }, 10000)
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

    setMessage(null)
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
  }, [exchangeState.currentPair])

  return (
    <Box className={classes.exchangeRoot}>
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">Exchange Has Evolved!</Typography>
        <Typography variant="body1">
          A truly decentralized exchange where you decide your pool fees.
        </Typography>
      </Box>
      <Box className={classes.inputBox}>
        <InputTextAndSelect
          label="You Give"
          options={options.youGive}
          onChange={handleOnChange('youGive')}
          value={youGive}
        />
        <IconButton aria-label="switch" onClick={handleOnSwitchValues}>
          {isDesktop ? <SwapHorizIcon /> : <ImportExportIcon />}
        </IconButton>
        <InputTextAndSelect
          label="You Receive"
          options={options.youReceive}
          onChange={handleOnChange('youReceive')}
          value={youReceive}
          inputDisabled
        />
      </Box>
      {pair && (
        <Box className={classes.rateFeeBox}>
          <Typography variant="body1">
            <strong>Rate: </strong>
            {assets && (
              <span>
                {assets.assetToGive.toString()} ={' '}
                {assets.assetToReceive.toString()}
              </span>
            )}
          </Typography>
          <Typography variant="body1">
            <strong>Fee:</strong> {Number(pair.fee) / 100}%
          </Typography>
        </Box>
      )}
      <Box className={classes.btnExchange}>
        <Button
          variant="contained"
          isLightMode={isLightMode}
          onClick={handleOnExchange}
        >
          EXCHANGE
        </Button>
      </Box>
      {loading && (
        <LinearProgress className={classes.loading} color="secondary" />
      )}
      {message && (
        <Box className={classes.message}>
          <Alert
            severity={message.type}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setMessage(null)
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {message.text}
          </Alert>
        </Box>
      )}
    </Box>
  )
}

ExchangeBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool
}

export default ExchangeBackLayer
