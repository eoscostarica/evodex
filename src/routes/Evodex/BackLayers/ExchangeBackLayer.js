import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import IconButton from '@material-ui/core/IconButton'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'

import InputTextAndSelect from '../../../components/InputTextAndSelect'
import EvodexRocketSvg from '../../../components/Icons/EvodexRocket'
import Button from '../../../components/Button'
import { useExchange } from '../../../context/exchange.context'
import { getValidTokens } from '../../../utils'

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
  }
}))

const ExchangeBackLayer = () => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })
  const [{ tokenPairs }, { fetchTokenPairs }] = useExchange()
  const [currentPair, setCurrentPair] = useState([])
  const [youGiveOptions, setYouGiveOptions] = useState([])
  const [youReceiveOptions, setYouReceiveOptions] = useState([])
  const [data, setData] = useState({})

  useEffect(() => {
    fetchTokenPairs()
  }, [])

  useEffect(() => {
    const tokens = tokenPairs.reduce(
      (temp, item) => ({
        ...temp,
        [item.token1]: item.token1,
        [item.token2]: item.token2
      }),
      {}
    )
    const options = Object.keys(tokens).map((token) => ({
      value: token,
      label: token
    }))

    if (data?.token1?.symbol) {
      const validTokens = getValidTokens(tokenPairs, data?.token1?.symbol)
      setYouReceiveOptions(
        options.filter((option) => validTokens.includes(option.value))
      )
    } else {
      setYouReceiveOptions(options)
    }

    if (data?.token2?.symbol) {
      const validTokens = getValidTokens(tokenPairs, data?.token2?.symbol)
      setYouGiveOptions(
        options.filter((option) => validTokens.includes(option.value))
      )
    } else {
      setYouGiveOptions(options)
    }

    if (data?.token1?.symbol && data?.token2?.symbol) {
      setCurrentPair(
        tokenPairs.find(
          (item) =>
            (item.token1 === data?.token1?.symbol &&
              item.token2 === data?.token2?.symbol) ||
            (item.token2 === data?.token1?.symbol &&
              item.token1 === data?.token2?.symbol)
        )
      )
    } else {
      setCurrentPair(null)
    }
  }, [tokenPairs, data])

  const handleOnChange = (value, key) => {
    setData({
      ...data,
      [key]: {
        symbol: value.selectValue,
        amount: value.inputValue
      }
    })
  }

  const handleOnSwitchValues = () => {
    setData({
      token1: data.token2,
      token2: data.token1
    })
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
          options={youGiveOptions}
          onChange={(value) => handleOnChange(value, 'token1')}
          // selected={inputValues.youReceive.selectValue}
          value={{
            selectValue: data?.token1?.symbol,
            inputValue: data?.token1?.amount
          }}
        />
        <IconButton aria-label="switch" onClick={handleOnSwitchValues}>
          {isDesktop ? <SwapHorizIcon /> : <ImportExportIcon />}
        </IconButton>
        <InputTextAndSelect
          label="You Receive"
          options={youReceiveOptions}
          onChange={(value) => handleOnChange(value, 'token2')}
          // selected={inputValues.youGive.selectValue}
          value={{
            selectValue: data?.token2?.symbol,
            inputValue: data?.token2?.amount
          }}
        />
      </Box>
      <Box className={classes.rateFeeBox}>
        <Typography variant="body1">
          <strong>Rate:</strong>:{' '}
          {currentPair && (
            <span>
              1 {data?.token1?.symbol} = 0.1 {data?.token2?.symbol}
            </span>
          )}
          {!currentPair && <span>N/A</span>}
        </Typography>
        <Typography variant="body1">
          <strong>Fee:</strong>{' '}
          {currentPair && <span>{currentPair?.fee}%</span>}
          {!currentPair && <span>N/A</span>}
        </Typography>
      </Box>
      <Box className={classes.btnExchange}>
        <Button variant="contained">EXCHANGE</Button>
      </Box>
    </Box>
  )
}

ExchangeBackLayer.propTypes = {}

export default ExchangeBackLayer
