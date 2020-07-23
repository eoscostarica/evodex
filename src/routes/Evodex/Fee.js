import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'

import Table from '../../components/Table'
import { useExchange } from '../../context/exchange.context'

const useStyles = makeStyles((theme) => ({
  inputSearch: {
    height: 48
  }
}))

const Fee = () => {
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
      <Table data={pairs} />
    </Box>
  )
}

Fee.propTypes = {}

export default Fee
