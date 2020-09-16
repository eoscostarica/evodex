import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Table from '../Table'
import { commonStyles } from 'utils'

const useStyles = makeStyles((theme) => {
  const { boxMessage, link } = commonStyles(theme)

  return {
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
    },
    boxMessage,
    link
  }
})

const CollapseTable = ({ data, label, onClick, message }) => {
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
        {/* {data?.length === 0 && !isActiveUser && (
          <Box className={classes.boxMessage}>
            <Typography onClick={onClickLink} className={classes.link}>
              Login
            </Typography>
            <Typography>to view your pools.</Typography>
          </Box>
        )}
        {data?.length === 0 && isActiveUser && (
          <Box className={classes.boxMessage}>
            <Typography>No token pairs found.</Typography>
            {showAddLiquidityLink && (
              <Typography onClick={onClickLink} className={classes.link}>
                Add liquidity now.
              </Typography>
            )}
          </Box>
        )} */}
        {!data?.length && !message ? (
          <Box className={classes.boxMessage}>
            <Typography>No token pairs found.</Typography>
          </Box>
        ) : (
          message
        )}
        {data?.length > 0 && <Table data={data} onClick={onClick} />}
      </Collapse>
    </List>
  )
}

CollapseTable.propTypes = {
  data: PropTypes.array,
  label: PropTypes.string,
  onClick: PropTypes.func,
  message: PropTypes.any
}

CollapseTable.defaultProps = {
  onClick: () => {},
  message: false
}

export default CollapseTable
