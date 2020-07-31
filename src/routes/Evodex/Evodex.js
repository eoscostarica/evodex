import React, { useEffect, useState, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { Backdrop } from '@eoscostarica/eoscr-components'

import { MainContainer } from '../../containers'
import { evolutiondex } from '../../utils'
import { ExchangeProvider } from '../../context/exchange.context'
import Faq from '../FAQ'
import About from '../About'

import BackLayer from './BackLayers'
import Sidebar from './Sidebar'
import SubMenuTopBar from './SubmenuTopbar'
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
    padding: 16,
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(32),
      paddingLeft: theme.spacing(32)
    }
  },
  backLayer: {
    overflowY: 'auto',
    paddingBottom: 10
  },
  headerBox: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(32),
      paddingLeft: theme.spacing(32)
    }
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
  rootLight: {
    background:
      'linear-gradient(180deg, rgba(8,55,193,1) 3%, rgba(25,118,210,1) 84%, rgba(25,118,210,1) 100%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderImage:
      'linear-gradient( to bottom, #0837c1, rgba(0, 0, 0, 0)) 1 100%',
    borderBottomWidth: 0
  },
  rootDark: {
    background:
      'linear-gradient(180deg, rgba(35, 43, 85, 0.9822303921568627) 2%, rgba(39,40,99,1) 31%, rgba(39,40,99,1) 100%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderImage:
      'linear-gradient( to bottom, #272863, rgba(0, 0, 0, 0)) 1 100%',
    borderBottomWidth: 0
  },
  labelBackdrop: {
    fontSize: 20.2,
    fontWeight: 600,
    letterSpacing: '0.25px',
    color: 'rgba(0, 0, 0, 0.6)'
  },
  headerBoxNone: {
    display: 'none'
  }
}))

const Evodex = ({ ual }) => {
  const classes = useStyles()
  const location = useLocation()
  const theme = useTheme()
  const [openSidebar, setOpenSidebar] = useState(false)
  const [title, setTitle] = useState('Token Listings')
  const [isLightMode, setIsLightMode] = useState(false)
  const [layerHeight, setLayerHeight] = useState(56)
  const [exgangeInfo, setExchangeInfo] = useState(null)
  const [isStaticPage, setIsStaticPage] = useState(false)
  const backdropRef = useRef()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
    defaultMatches: true
  })
  const handleOnClickRow = () => {
    if (backdropRef?.current?.toggleOnClickMobile) {
      backdropRef.current.toggleOnClickMobile()
    }
  }
  const frontLayer = (
    <div className={classes.frontLayer}>
      <Switch>
        <Route exact path="/evodex/liquidity">
          <Liquidity onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/evodex/exchange">
          <Exchange onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/evodex/fee">
          <Fee onClickRow={handleOnClickRow} />
        </Route>
        <Route exact path="/evodex/faq" component={Faq} />
        <Route exact path="/evodex/about" component={About} />
        <Redirect from="/evodex" to="/evodex/exchange" />
      </Switch>
    </div>
  )

  const handleOnReload = async () => {
    const info = await evolutiondex.getInfo(ual)

    setExchangeInfo((prevValue) => ({
      ...prevValue,
      ...info
    }))
  }

  useEffect(() => {
    handleOnReload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ual.activeUser])

  useEffect(() => {
    if (
      location.pathname === '/evodex/faq' ||
      location.pathname === '/evodex/about'
    ) {
      setLayerHeight(180)
      setTitle('Subtitle')
      setIsStaticPage(true)

      return
    }

    setIsStaticPage(false)

    if (isMobile) {
      setTitle('Token Listings')
      setLayerHeight(56)

      return
    }

    setLayerHeight(470)
    setTitle('Token Listings')
  }, [isMobile, location.pathname])

  return (
    <ExchangeProvider info={exgangeInfo}>
      <MainContainer
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        isLightMode={isLightMode}
        subMenu={<SubMenuTopBar pathname={location.pathname} />}
        topbarContent={
          <Topbar
            user={ual.activeUser}
            onLogout={() => ual.logout()}
            onLogin={() => ual.showModal()}
            onChangeDarkMode={setIsLightMode}
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
          ref={backdropRef}
          className={classes.backdrop}
          classes={{
            frontLayer: classes.frontLayerRoot,
            root: isLightMode ? classes.rootLight : classes.rootDark,
            backLayer: classes.backLayer,
            headerBox:
              isStaticPage || isMobile
                ? classes.headerBox
                : classes.headerBoxNone
          }}
          backLayer={
            <BackLayer
              ual={ual}
              onReload={handleOnReload}
              pathname={location.pathname}
              isLightMode={isLightMode}
            />
          }
          frontLayer={frontLayer}
          headerText={
            <Typography className={classes.labelBackdrop}>{title}</Typography>
          }
          backgroundColor={isLightMode ? '#1976d2' : '#272863'}
          layerHeight={layerHeight}
          isStaticPage={isStaticPage}
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

export default memo(Evodex)
