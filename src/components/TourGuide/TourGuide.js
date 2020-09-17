import React from 'react'
import PropTypes from 'prop-types'
import Tour from 'reactour'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  helper: {
    lineHeight: 1.3,
    color: '#2d2323',
    '& > div': {
      justifyContent: 'center',
      marginTop: theme.spacing(2)
    },
    '& > span': {
      display: 'none'
    },
    '& > button': {
      top: 10,
      right: 10,
      '& > svg': {
        width: 12,
        height: 12
      }
    }
  }
}))

const TourGuide = ({ setIsTourOpen, isTourOpen, steps }) => {
  const classes = useStyles()

  return (
    <Tour
      steps={steps}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
      rounded={10}
      className={classes.helper}
      accentColor="#5cb7b7"
    />
  )
}

TourGuide.propTypes = {
  setIsTourOpen: PropTypes.func,
  isTourOpen: PropTypes.bool,
  steps: PropTypes.array
}

export default TourGuide
