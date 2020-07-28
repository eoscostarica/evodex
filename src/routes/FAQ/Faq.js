import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CustomRouterLink from '../../components/CustomRouterLink'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    height: '100vh'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  centerText: {
    textAlign: 'center'
  }
}))

const FAQ = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} className={classes.content}>
          <div className={classes.centerText}>
            <Typography variant="h1">Work in progress</Typography>
            <Button
              variant="contained"
              color="primary"
              activeClassName={classes.active}
              component={CustomRouterLink}
              to="/"
            >
              Take me home
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default FAQ
