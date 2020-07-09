import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import Table from '../Table'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    width: '100%',
    height: 30,
    padding: 0,
    '& span': {
      fontSize: 12.1,
      fontWeight: 600,
      lineHeight: 1.32,
      letterSpacing: '2px',
      color: 'rgba(0, 0, 0, 0.87)'
    }
  }
}))

const CollapseTable = ({ data, label }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <List className={classes.root}>
      <ListItem button onClick={handleClick} className={classes.bar}>
        <ListItemText primary={(label || '').toUpperCase()} />
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Table data={data} />
      </Collapse>
    </List>
  )
}

CollapseTable.propTypes = {
  data: PropTypes.array,
  label: PropTypes.string
}

export default CollapseTable
