import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'

import ExchangeBackLayer from './Exchange'
import FeeBackLayer from './Fee'
import LiquidityBackLayer from './Liquidity'
import RicardianContractBackLayer from './RicardianContract'
import AboutBackLayer from './About'
import FaqBackLayer from './Faq'

const useStyles = makeStyles((theme) => ({
  backLayer: {
    height: '100%',
    overflowY: 'auto',
    padding: 16,
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(32),
      paddingLeft: theme.spacing(32)
    }
  }
}))

const BackLayer = ({
  pathname,
  onReload,
  ual,
  isLightMode,
  showMessage,
  getTourSteps
}) => {
  const classes = useStyles()

  return (
    <Box className={classes.backLayer}>
      <Switch>
        <Route exact path="/liquidity">
          <LiquidityBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
            getTourSteps={getTourSteps}
          />
        </Route>
        <Route exact path="/exchange">
          <ExchangeBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
            getTourSteps={getTourSteps}
          />
        </Route>
        <Route exact path="/fee">
          <FeeBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
            getTourSteps={getTourSteps}
          />
        </Route>
        <Route exact path="/faq" component={FaqBackLayer} />
        <Route exact path="/about" component={AboutBackLayer} />
        <Route
          exact
          path="/ricardian-contract"
          component={RicardianContractBackLayer}
        />
        <Redirect from="/" to="/exchange" />
      </Switch>
    </Box>
  )
}

BackLayer.propTypes = {
  pathname: PropTypes.string,
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func,
  getTourSteps: PropTypes.func
}

export default BackLayer
