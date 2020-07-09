import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const ButtomStyled = withStyles((theme) => ({
  root: {
    color: '#fff',
    borderRadius: 30,
    padding: '6px 16px',
    backgroundColor: '#f4511e',
    '&:hover': {
      backgroundColor: '#cc6d2e'
    }
  }
}))(Button)

export default (props) => <ButtomStyled {...props} />
