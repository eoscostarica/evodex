import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { Backdrop } from '@eoscostarica/eoscr-components'

import { MainContainer } from '../../containers'
import { ExchangeProvider } from '../../context/exchange.context'

import BackLayer from './BackLayers'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Liquidity from './Liquidity'
import Exchange from './Exchange'
import Fee from './Fee'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'relative',
    width: '100vw',
    height: 'calc(100vh - 64px)',
    overflowY: 'hidden',
    [theme.breakpoints.up('sm')]: {
      height: '100vh'
    }
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
  headerBox: {}, // padding box
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
      'linear-gradient(180deg, rgba(8,55,193,1) 3%, rgba(25,118,210,1) 84%, rgba(25,118,210,1) 100%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderImage:
      'linear-gradient( to bottom, #0837c1, rgba(0, 0, 0, 0)) 1 100%',
    borderBottomWidth: 0
  },
  labelBackdrop: {
    fontSize: 20.2,
    fontWeight: 600,
    letterSpacing: '0.25px',
    color: 'rgba(0, 0, 0, 0.6)'
  }
}))

const Evodex = ({ ual }) => {
  const classes = useStyles()
  const location = useLocation()
  const theme = useTheme()
  const [openSidebar, setOpenSidebar] = useState(false)
  const [layerHeight, setLayerHeight] = useState(56)
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })

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

  useEffect(() => {
    if (isDesktop) {
      setLayerHeight(500)
    } else {
      setLayerHeight(56)
    }
  }, [isDesktop])

  return (
    <ExchangeProvider>
      <MainContainer
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
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
            setOpenSidebar={setOpenSidebar}
          />
        }
      >
        <Backdrop
          className={classes.backdrop}
          classes={{ frontLayer: classes.frontLayerRoot, root: classes.root }}
          backLayer={<BackLayer ual={ual} pathname={location.pathname} />}
          frontLayer={frontLayer}
          headerText={
            <Typography className={classes.labelBackdrop}>
              Token Listings
            </Typography>
          }
          backgroundColor="#1976d2"
          layerHeight={layerHeight}
        />
      </MainContainer>
    </ExchangeProvider>
  )
}

Evodex.propTypes = {
  ual: PropTypes.object
}

Evodex.defaultProps = {
  ual: {}
}

export default Evodex
