import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

import night from '../../assets/night.png'
import sunny from '../../assets/sunny.png'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 50,
    height: 25,
    '& input': {
      opacity: 0,
      width: 0,
      height: 0
    },
    '& input:checked + $slider': {
      backgroundColor: '#00000040'
    },
    '& input:focus + $slider': {
      boxDhadow: '0 0 1px #2196f3'
    },
    '& input:checked + $slider:before': {
      transform: 'translateX(24px)',
      backgroundColor: '#fff',
      backgroundImage: `url(${sunny})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000040',
    transition: '0.4s',
    '&:before': {
      position: 'absolute',
      content: '""',
      height: 30,
      width: 30,
      left: 0,
      // bottom: 4,
      top: 0,
      bottom: 0,
      margin: 'auto 0',
      transition: '0.4s',
      boxShadow: '0 0px 15px #2020203d',
      backgroundColor: '#fff',
      backgroundImage: `url(${night})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  },
  round: {
    borderRadius: 34,
    '&:before': {
      borderRadius: '50%'
    }
  }
}))

const DarkModeSwitch = ({ onChangeDarkMode }) => {
  const classes = useStyles()
  const [isCheck, setIsCheck] = useState(false)

  const handleOnChange = () => {
    setIsCheck(!isCheck)
    onChangeDarkMode(!isCheck)
  }

  return (
    <Box className={classes.root}>
      <label className={classes.switch}>
        <input type="checkbox" onChange={handleOnChange} checked={isCheck} />
        <span className={clsx(classes.slider, classes.round)} />
      </label>
    </Box>
  )
}

DarkModeSwitch.propTypes = {
  onChangeDarkMode: PropTypes.func
}

export default DarkModeSwitch
