import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'

import CollapseTable from '../../components/CollapseTable'

const useStyles = makeStyles((theme) => ({
  inputSearch: {
    height: 48
  }
}))

const table1 = [
  { token: 'ABCEOS', lume: '0.2450', fee: '0.1%' },
  { token: 'EVOWAX', lume: '1.0427', fee: '0.12%' }
]

const table2 = [
  { token: 'ABCEOS', lume: '12,0403', fee: '0.1%' },
  { token: 'EVOABC', lume: '230.0012', fee: '0.2%' },
  { token: 'EVOUSDT', lume: '12,0403', fee: '0.1%' },
  { token: 'ABCEOS', lume: '12,0403', fee: '0.2%' },
  { token: 'EVOABC', lume: '230.0012', fee: '0.1%' }
]

const Liquidity = () => {
  const classes = useStyles()

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
      <CollapseTable data={table1} label="My Pool" />
      <CollapseTable data={table2} label="Community Pool" />
    </Box>
  )
}

Liquidity.propTypes = {}

export default Liquidity
