import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ffffff',
    cursor: 'pointer'
  },
  body: {
    padding: theme.spacing(2)
  },
  title: {
    fontSize: 12.1,
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.32,
    letterSpacing: 2,
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  arrow: {
    color: '#ffffff'
  }
}))

const CollapseSection = ({ title, children }) => {
  const classes = useStyles()
  const [showAdvancedInfo, setShowAdvancedInfo] = useState(false)

  const handleOnClick = () => {
    setShowAdvancedInfo((prevValue) => !prevValue)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header} onClick={handleOnClick}>
        <Typography variant="body1" className={classes.title}>
          {title}
        </Typography>
        {showAdvancedInfo ? (
          <ArrowDropUpIcon className={classes.arrow} />
        ) : (
          <ArrowDropDownIcon className={classes.arrow} />
        )}
      </Box>
      <Collapse in={showAdvancedInfo} timeout="auto" unmountOnExit>
        <Box className={classes.body}>{children}</Box>
      </Collapse>
    </Box>
  )
}

CollapseSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
}

export default CollapseSection
