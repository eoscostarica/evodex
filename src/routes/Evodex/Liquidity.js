import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'

import CollapseTable from '../../components/CollapseTable'
import { useExchange } from '../../context/exchange.context'

const useStyles = makeStyles(() => ({
  inputSearch: {
    height: 48
  }
}))

const Liquidity = () => {
  const classes = useStyles()
  const [{ tokenPairs }, exchangeActions] = useExchange()

  useEffect(() => {
    exchangeActions.fetchTokenPairs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <OutlinedInput
        id="outlined-adornment-amount"
        value={null}
        onChange={() => {}}
        fullWidth
        startAdornment={<SearchIcon />}
        className={classes.inputSearch}
      />
      <CollapseTable data={[]} label="My Pool" />
      <CollapseTable data={tokenPairs} label="Community Pool" />
    </Box>
  )
}

Liquidity.propTypes = {}

export default Liquidity
