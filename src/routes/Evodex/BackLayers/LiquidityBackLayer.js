import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

import InputTextAndSelect from '../../../components/InputTextAndSelect'
import Button from '../../../components/Button'
import { useExchange } from '../../../context/exchange.context'

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
  }
}))

const LiquidityBackLayer = () => {
  const classes = useStyles()
  const [{ tokenOptions }, exchangeActions] = useExchange()

  useEffect(() => {
    exchangeActions.fetchTokenPairs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            options={tokenOptions}
            label="You Give"
            helperText="14.0569 EVO available"
          />
        </Box>
        <Box className={classes.rateFeeBox}>
          <Typography variant="body1">
            <strong>Rate:</strong> 1 EOS = 0.1 EVO
          </Typography>
          <Typography variant="body1">
            <strong>Fee:</strong> 0.1%
          </Typography>
        </Box>
        <Box className={classes.btnExchange}>
          <Button variant="contained" startIcon={<AddIcon />}>
            ADD
          </Button>
          <Button variant="contained" startIcon={<RemoveIcon />}>
            REMOVE
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

LiquidityBackLayer.propTypes = {}

export default LiquidityBackLayer
