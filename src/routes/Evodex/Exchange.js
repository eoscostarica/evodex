import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'
import { Typography } from '@material-ui/core'

import Table from '../../components/Table'
import { useExchange } from '../../context/exchange.context'

const useStyles = makeStyles(() => ({
  inputSearch: {
    height: 48
  }
}))

const Exchange = () => {
  const classes = useStyles()
  const [{ pairs }, { update }] = useExchange()
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState('')

  const handleOnClick = (currentPair) => {
    update({
      currentPair
    })
  }

  useEffect(() => {
    let options = pairs

    if (filter) {
      options = options.filter((pair) =>
        pair.token.includes(filter.toUpperCase())
      )
    }

    setOptions(options)
  }, [pairs, filter])

  return (
    <Box>
      <OutlinedInput
        id="outlined-adornment-amount"
        fullWidth
        startAdornment={<SearchIcon />}
        className={classes.inputSearch}
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      />
      {options?.length > 0 && <Table data={options} onClick={handleOnClick} />}
      {options?.length === 0 && <Typography>Empty</Typography>}
    </Box>
  )
}

Exchange.propTypes = {}

export default Exchange
