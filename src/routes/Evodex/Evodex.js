import React from 'react'
import PropTypes from 'prop-types'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { Backdrop } from '@eoscostarica/eoscr-components'

import { MainContainer } from '../../containers'

import BackLayer from './BackLayers'

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Liquidity from './Liquidity'
import Exchange from './Exchange'
import Fee from './Fee'

const useStyles = makeStyles({
  backdrop: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflowY: 'hidden'
  },
  frontLayer: {
    height: '100%',
    overflowY: 'auto',
    padding: 16
  },
  backLayer: {
    display: 'flex',
    position: 'relative',
    height: '100%'
  },
  menu: {
    flexGrow: 1,
    marginTop: 80
  },
  menuButton: {
    marginRight: 16
  },
  title: {
    flexGrow: 1
  },
  frontLayerRoot: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 0
  },
  root: {
    background:
      'linear-gradient(180deg, rgba(7,53,194,1) 0%, rgba(9,57,193,1) 15%, rgba(25,118,210,1) 100%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderImage:
      'linear-gradient( to bottom, #233955, rgba(0, 0, 0, 0)) 1 100%',
    borderBottomWidth: 0
  }
})

const Evodex = ({ ual }) => {
  const classes = useStyles()
  const location = useLocation()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })
  const extraProps = isDesktop ? { layerHeight: 500 } : { layerHeight: 56 }

  const frontLayer = (
    <div className={classes.frontLayer}>
      <Switch>
        <Route exact path="/evodex/liquidity" component={Liquidity} />
        <Route exact path="/evodex/exchange" component={Exchange} />
        <Route exact path="/evodex/fee" component={Fee} />
        <Redirect from="/evodex" to="/evodex/exchange" />
      </Switch>
    </div>
  )

  return (
    <MainContainer
      topbarContent={
        <Topbar
          user={ual.activeUser}
          onLogout={() => ual.logout()}
          onLogin={() => ual.showModal()}
        />
      }
      sidebarContent={
        <Sidebar
          user={ual.activeUser}
          onLogout={() => ual.logout()}
          onLogin={() => ual.showModal()}
        />
      }
    >
      <Backdrop
        className={classes.backdrop}
        classes={{ frontLayer: classes.frontLayerRoot, root: classes.root }}
        backLayer={<BackLayer pathname={location.pathname} />}
        frontLayer={frontLayer}
        headerText="Token Listings"
        backgroundColor="#1976d2"
        {...extraProps}
      />
    </MainContainer>
  )
}

Evodex.propTypes = {
  ual: PropTypes.object
}

Evodex.defaultProps = {
  ual: {}
}

export default Evodex
