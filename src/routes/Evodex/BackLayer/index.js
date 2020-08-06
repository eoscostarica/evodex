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

const BackLayer = ({ pathname, onReload, ual, isLightMode, showMessage }) => {
  const classes = useStyles()

  return (
    <Box className={classes.backLayer}>
      <Switch>
        <Route exact path="/evodex/liquidity">
          <LiquidityBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
          />
        </Route>
        <Route exact path="/evodex/exchange">
          <ExchangeBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
          />
        </Route>
        <Route exact path="/evodex/fee">
          <FeeBackLayer
            ual={ual}
            onReload={onReload}
            isLightMode={isLightMode}
            showMessage={showMessage}
          />
        </Route>
        <Route exact path="/evodex/faq" component={FaqBackLayer} />
        <Route exact path="/evodex/about" component={AboutBackLayer} />
        <Route
          exact
          path="/evodex/ricardian-contract"
          component={RicardianContractBackLayer}
        />
        <Redirect from="/evodex" to="/evodex/exchange" />
      </Switch>
    </Box>
  )
}

BackLayer.propTypes = {
  pathname: PropTypes.string,
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool,
  showMessage: PropTypes.func
}

export default BackLayer
