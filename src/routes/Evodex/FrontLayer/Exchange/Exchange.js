import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import SearchIcon from '@material-ui/icons/Search'

import Table from 'components/Table'
import { useExchange } from 'context/exchange.context'

const useStyles = makeStyles((theme) => ({
  inputSearch: {
    height: 48,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 275
    },
    [theme.breakpoints.up('lg')]: {
      width: 298
    }
  },
  labelPage: {
    fontSize: 20.2,
    fontWeight: 600,
    letterSpacing: '0.25px',
    color: 'rgba(0, 0, 0, 0.6)',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  headerFrontLayer: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }
}))

const Exchange = ({ onClickRow }) => {
  const classes = useStyles()
  const [{ pairs }, { update }] = useExchange()
  const [options, setOptions] = useState([])
  const [filter, setFilter] = useState('')

  const handleOnClick = (currentPair) => {
    onClickRow && onClickRow()
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
      <Box className={classes.headerFrontLayer}>
        <Typography className={classes.labelPage}>Token Listings</Typography>
        <OutlinedInput
          id="outlined-adornment-amount"
          startAdornment={<SearchIcon />}
          className={classes.inputSearch}
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        />
      </Box>
      {options?.length > 0 && <Table data={options} onClick={handleOnClick} />}
      {options?.length === 0 && <Typography>Empty</Typography>}
    </Box>
  )
}

Exchange.propTypes = {
  onClickRow: PropTypes.func
}

export default Exchange
