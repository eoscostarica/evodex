import React from 'react'
import clsx from 'clsx'
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
  },
  noPaddingTop: {
    paddingTop: '0px !important',
    marginTop: theme.spacing(5)
  }
}))

const FrontLayer = ({ handleOnClickRow, pathname, isMobile }) => {
  const classes = useStyles()

  return (
    <Box
      className={clsx(classes.frontLayer, {
        [classes.noPaddingTop]: pathname === '/ricardian-contract'
      })}
    >
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
        <Route exact path="/ricardian-contract">
          <RicardianContract isMobile={isMobile} />
        </Route>
        <Redirect from="/" to="/exchange" />
      </Switch>
    </Box>
  )
}

FrontLayer.propTypes = {
  handleOnClickRow: PropTypes.func,
  pathname: PropTypes.string,
  isMobile: PropTypes.bool
}

export default FrontLayer
