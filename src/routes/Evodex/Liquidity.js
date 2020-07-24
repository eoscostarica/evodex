import React, { useState, useEffect } from 'react'
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
  const [{ pairs }, { update }] = useExchange()
  const [myPools, setMyPools] = useState([])
  const [communityPools, setCommunityPools] = useState([])
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

    setMyPools(options.filter((pair) => !!pair.balance))
    setCommunityPools(options)
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
      <CollapseTable data={myPools} label="My Pool" onClick={handleOnClick} />
      <CollapseTable
        data={communityPools}
        label="Community Pool"
        onClick={handleOnClick}
      />
    </Box>
  )
}

Liquidity.propTypes = {}

export default Liquidity
