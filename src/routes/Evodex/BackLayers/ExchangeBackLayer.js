import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import IconButton from '@material-ui/core/IconButton'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import Alert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'
import { asset, number_to_asset } from 'eos-common'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'

import InputTextAndSelect from '../../../components/InputTextAndSelect'
import EvodexRocketSvg from '../../../components/Icons/EvodexRocket'
import Button from '../../../components/Button'
import { useExchange } from '../../../context/exchange.context'
import { getScatterError } from '../../../utils'

const contactName = 'evolutiondex'

const useStyles = makeStyles((theme) => ({
  exchangeRoot: {
    marginTop: theme.spacing(7),
    padding: theme.spacing(3, 1, 0, 1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  },
  titleBox: {
    width: 225,
    paddingLeft: theme.spacing(3),
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
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2, 10)
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
    }
  },
  message: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    justifyContent: 'center'
  },
  loading: {
    marginTop: theme.spacing(2)
  }
}))

const ExchangeBackLayer = ({ ual }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })
  const [{ tokenPairs, tokenOptions }, exchangeActions] = useExchange()
  const [currentPair, setCurrentPair] = useState([])
  const [options, setOptions] = useState({ youGive: [], youReceive: [] })
  const [youReceive, setYouReceive] = useState({})
  const [youGive, setYouGive] = useState({})
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    exchangeActions.fetchTokenPairs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      youGive: exchangeActions.getValidOptionsForToken(youReceive.selectValue),
      youReceive: exchangeActions.getValidOptionsForToken(youGive.selectValue)
    }))
    setCurrentPair(
      exchangeActions.getTokenPair(youGive.selectValue, youReceive.selectValue)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenOptions, tokenPairs, youGive, youReceive])

  useEffect(() => {
    if (!currentPair || !youGive.inputValue) {
      setYouReceive((prevState) => ({
        ...prevState,
        inputValue: 0
      }))

      return
    }

    const currentPool =
      youGive.selectValue === currentPair.pool1.symbol.code().to_string()
        ? 'pool1'
        : 'pool2'

    let youReceiveAsset
    let computeForwardResult
    let youGiveAmount = (parseFloat(youGive.inputValue) || 0).toFixed(
      currentPair[currentPool].symbol.precision()
    )
    youGiveAmount = asset(
      `${youGiveAmount} ${currentPair[currentPool].symbol.code().to_string()}`
    ).amount

    if (currentPool === 'pool1') {
      youReceiveAsset = number_to_asset(0, currentPair.pool2.symbol)
      computeForwardResult = Math.abs(
        exchangeActions.computeForward(
          youGiveAmount.multiply(-1),
          currentPair.pool2.amount,
          currentPair.pool1.amount.plus(youGiveAmount),
          currentPair.fee
        )
      )
    }

    if (currentPool === 'pool2') {
      youReceiveAsset = number_to_asset(0, currentPair.pool1.symbol)
      computeForwardResult = exchangeActions
        .computeForward(
          youGiveAmount.multiply(-1),
          currentPair.pool1.amount,
          currentPair.pool2.amount.plus(youGiveAmount),
          currentPair.fee
        )
        .abs()
    }

    youReceiveAsset.set_amount(computeForwardResult)
    setYouReceive((prevState) => ({
      ...prevState,
      inputValue: youReceiveAsset.to_string().split(' ')[0]
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPair, youGive])

  const handleOnChange = (key) => (value) => {
    let set
    setMessage(null)

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
    setYouGive(youReceive)
    setYouReceive(youGive)
    setMessage(null)
  }

  const handleOnExchange = async () => {
    if (!ual.activeUser) {
      setMessage({ type: 'warning', text: 'Please login to continue' })
      return
    }

    if (!currentPair) {
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
      const result = await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: contactName,
              name: 'exchange',
              authorization: [
                {
                  actor: ual.activeUser.accountName,
                  permission: 'active'
                }
              ],
              data: {
                user: ual.activeUser.accountName,
                pair_token: currentPair.tokenPair,
                ext_asset_in: {
                  contract: 'eosio.token',
                  quantity: `${youGive.inputValue} ${youGive.selectValue}`
                },
                min_expected: `${youReceive.inputValue} ${youReceive.selectValue}`
              }
            }
          ]
        },
        {
          broadcast: true
        }
      )
      setMessage((prevState) => ({
        ...prevState,
        type: 'success',
        text: (
          <span>
            Success exhange for {currentPair.tokenPair}
            <Link
              href={`https://jungles.bloks.io/transaction/${result.transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.transactionId}
            </Link>
          </span>
        )
      }))
    } catch (error) {
      setMessage((prevState) => ({
        ...prevState,
        type: 'error',
        text: getScatterError(error)
      }))
    }

    setLoading(false)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

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
          inputDisabled={true}
        />
      </Box>
      <Box className={classes.rateFeeBox}>
        <Typography variant="body1">
          {currentPair && <strong>{currentPair.tokenPair} </strong>}
          {currentPair &&
            youReceive.inputValue?.length &&
            youGive.inputValue?.length && (
              <span>
                <strong>Rate:</strong> 1 {youGive.selectValue} ={' '}
                {(
                  parseFloat(youReceive.inputValue) /
                  parseFloat(youGive.inputValue)
                ).toFixed(4)}{' '}
                {youReceive.selectValue}
              </span>
            )}
        </Typography>
        <Typography variant="body1">
          {currentPair?.fee && (
            <span>
              <strong>Fee:</strong> {Number(currentPair.fee) / 100}%
            </span>
          )}
        </Typography>
      </Box>
      <Box className={classes.btnExchange}>
        <Button variant="contained" onClick={handleOnExchange}>
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
  ual: PropTypes.object
}

export default ExchangeBackLayer
