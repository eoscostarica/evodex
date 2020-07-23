import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import CloseIcon from '@material-ui/icons/Close'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'

import { ualConfig } from '../../../config'
import InputTextAndSelect from '../../../components/InputTextAndSelect'
import Button from '../../../components/Button'
import { useExchange } from '../../../context/exchange.context'
import { evolutiondex } from '../../../utils'

const useStyles = makeStyles((theme) => ({
  liquidityRoot: {
    marginTop: theme.spacing(7),
    padding: theme.spacing(3, 1, 0, 1),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  },
  titleBox: {
    paddingLeft: theme.spacing(2),
    '& h4': {
      fontSize: 33,
      letterSpacing: '-0.49px',
      color: '#ffffff'
    },
    '& p': {
      fontSize: 20.2,
      fontWeight: 500,
      letterSpacing: '0.25px',
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
    justifyContent: 'space-evenly',
    paddingTop: theme.spacing(4),
    '& button': {
      width: 162,
      height: 36
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
    '& svg': {
      color: '#fff',
      fontSize: 30,
      margin: theme.spacing(3, 0)
    },
    [theme.breakpoints.up('md')]: {
      width: 500
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

const LiquidityBackLayer = ({ onReload, ual }) => {
  const classes = useStyles()
  const [{ pairs }] = useExchange()
  const [pair, setPair] = useState()
  const [toBuy, setToBuy] = useState()
  const [toSell, setToSell] = useState()
  const [youGive, setYouGive] = useState({})
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)

  const handleOnAddLiquidity = async () => {
    if (!ual.activeUser) {
      setMessage({ type: 'warning', text: 'Please login to continue' })
      return
    }

    if (!pair) {
      setMessage({
        type: 'warning',
        text: 'Please select a token to continue'
      })
      return
    }

    if (!youGive.inputValue) {
      setMessage({
        type: 'warning',
        text: 'Please enter the amount to add'
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { transactionId } = await evolutiondex.addLiquidity(
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
  const handleOnRemoveLiquidity = async () => {
    if (!ual.activeUser) {
      setMessage({ type: 'warning', text: 'Please login to continue' })
      return
    }

    if (!pair) {
      setMessage({
        type: 'warning',
        text: 'Please select a token to continue'
      })
      return
    }

    if (!youGive.inputValue) {
      setMessage({
        type: 'warning',
        text: 'Please enter the amount to remove'
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { transactionId } = await evolutiondex.removeLiquidity(
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
    setPair(pairs.find((pair) => pair.token === youGive.selectValue))
  }, [pairs, youGive.selectValue])

  useEffect(() => {
    if (!pair || !youGive.inputValue) {
      return
    }

    setToBuy(evolutiondex.getAddLiquidityAssets(youGive.inputValue, pair))
    setToSell(evolutiondex.getRemoveLiquidityAssets(youGive.inputValue, pair))
  }, [pair, youGive.inputValue])

  return (
    <Box className={classes.liquidityRoot}>
      <Box className={classes.titleBox}>
        <Typography variant="h4">Add or Remove Liquidity</Typography>
        <Typography variant="body1">
          Select a token pair and the amount you want to add or remove to the
          liquidity pool.
        </Typography>
      </Box>
      <Box className={classes.contentWrapper}>
        <Box className={classes.inputBox}>
          <InputTextAndSelect
            options={pairs.map((pair) => ({
              value: pair.token,
              label: pair.token
            }))}
            label="You Give"
            helperText={
              pair && (
                <span>
                  {pair.balance
                    ? `${pair.balance.toString()} `
                    : `0 ${pair.token} `}
                  available
                </span>
              )
            }
            onChange={setYouGive}
          />
        </Box>
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>Add: </strong>
              {toBuy && (
                <span>
                  {toBuy.asset1.toString()} and {toBuy.asset2.toString()}
                </span>
              )}
            </Typography>
            <Typography variant="body1">
              <strong>Fee:</strong> {Number(pair.fee) / 100}%
            </Typography>
          </Box>
        )}
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>Remove: </strong>
              {toSell && (
                <span>
                  {toSell.asset1.toString()} and {toSell.asset2.toString()}
                </span>
              )}
            </Typography>
            <Typography variant="body1">
              <strong>Fee:</strong> 0%
            </Typography>
          </Box>
        )}
        <Box className={classes.btnExchange}>
          <Button
            onClick={handleOnAddLiquidity}
            variant="contained"
            startIcon={<AddIcon />}
          >
            ADD
          </Button>
          <Button
            onClick={handleOnRemoveLiquidity}
            variant="contained"
            startIcon={<RemoveIcon />}
          >
            REMOVE
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
    </Box>
  )
}

LiquidityBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func
}

export default LiquidityBackLayer
