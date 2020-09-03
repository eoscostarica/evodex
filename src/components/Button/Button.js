import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  rootLight: {
    color: '#fff',
    borderRadius: 30,
    padding: '6px 16px',
    fontWeight: 700,
    backgroundColor: '#f4511e',
    '&:hover': {
      backgroundColor: '#cc6d2e'
    }
  },
  rootDark: {
    color: '#000',
    borderRadius: 30,
    padding: '6px 16px',
    fontWeight: 700,
    backgroundColor: '#60afff',
    '&:hover': {
      backgroundColor: '#60afffaa'
    }
  }
}))

const ButtomStyled = ({ isLightMode, ...props }) => {
  const classes = useStyles()

  return (
    <Button
      classes={{ root: isLightMode ? classes.rootLight : classes.rootDark }}
      {...props}
    />
  )
}

ButtomStyled.propTypes = {
  isLightMode: PropTypes.bool,
  props: PropTypes.any
}

export default ButtomStyled
