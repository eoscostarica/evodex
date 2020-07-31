import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
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
  feeRoot: {
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
      },
      '& h4': {
        letterSpacing: '-0.91px',
        fontSize: 59.2
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
      width: 800
    }
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

const FeeBackLayer = ({ onReload, ual, isLightMode }) => {
  const classes = useStyles()
  const [{ pairs, currentPair }] = useExchange()
  const [pair, setPair] = useState()
  const [yourVote, setYourVote] = useState({})
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)

  const handleOnChange = (value) => {
    setMessage(null)
    setYourVote((prevState) => ({
      ...prevState,
      ...value
    }))
  }

  const handleOnVote = async () => {
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

    if (!yourVote.inputValue) {
      setMessage({
        type: 'warning',
        text: 'Please enter your vote'
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { transactionId } = await evolutiondex.voteFee(
        yourVote.inputValue,
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
    setPair(pairs.find((pair) => pair.token === yourVote.selectValue))
  }, [pairs, yourVote.selectValue])

  useEffect(() => {
    if (!currentPair) {
      return
    }

    setMessage(null)
    setYourVote((prevValue) => ({
      ...prevValue,
      selectValue: currentPair.token
    }))
  }, [currentPair])

  return (
    <Box className={classes.feeRoot}>
      <EvodexRocketSvg classes={classes.rocketSvg} />
      <Box className={classes.titleBox}>
        <Typography variant="h4">Vote Your Fee</Typography>
        <Typography variant="body1">
          Select a Token Pair and the fee you want to vote for the liquidity
          pool.
        </Typography>
      </Box>
      <Box className={classes.contentWrapper}>
        <Box className={classes.inputBox}>
          <InputTextAndSelect
            options={pairs.map((pair) => ({
              value: pair.token,
              label: pair.token
            }))}
            id="feeYouVote"
            label="Vote"
            onChange={handleOnChange}
            value={yourVote}
          />
        </Box>
        {pair && (
          <Box className={classes.rateFeeBox}>
            <Typography variant="body1">
              <strong>Supply:</strong> {pair.supply.toString()}
            </Typography>
            <Typography variant="body1">
              <strong>Fee:</strong> {Number(pair.fee) / 100}%
            </Typography>
          </Box>
        )}
        <Box className={classes.btnExchange}>
          <Button
            onClick={handleOnVote}
            variant="contained"
            isLightMode={isLightMode}
          >
            VOTE
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

FeeBackLayer.propTypes = {
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool
}

export default FeeBackLayer
