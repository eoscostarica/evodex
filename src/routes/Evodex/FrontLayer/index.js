import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'

import RicardianContract from './RicardianContract'
import Faq from './Faq'
import About from './About'

import Liquidity from './Liquidity'
import Exchange from './Exchange'
import Fee from './Fee'

const useStyles = makeStyles((theme) => ({
  frontLayer: {
    height: '100%',
    overflowY: 'auto',
    padding: 16,
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(32),
      paddingLeft: theme.spacing(32)
    }
  }
}))

const FrontLayer = ({ handleOnClickRow }) => {
  const classes = useStyles()

  return (
    <Box className={classes.frontLayer}>
      <Switch>
        <Route exact path="/liquidity">
          <Liquidity onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/exchange">
          <Exchange onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/fee">
          <Fee onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/about" component={About} />
        <Route exact path="/ricardian-contract" component={RicardianContract} />
        <Redirect from="/" to="/exchange" />
      </Switch>
    </Box>
  )
}

FrontLayer.propTypes = {
  handleOnClickRow: PropTypes.func
}

export default FrontLayer
