import React from 'react'
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
  const [{ pairs }] = useExchange()

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
      <CollapseTable data={pairs} label="Community Pool" />
    </Box>
  )
}

Liquidity.propTypes = {}

export default Liquidity
