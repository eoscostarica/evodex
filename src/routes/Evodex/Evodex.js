import React, { useEffect, useState, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'react-i18next'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useLocation } from 'react-router-dom'
import { Backdrop } from '@eoscostarica/eoscr-components'
import Snackbar from '@material-ui/core/Snackbar'
import Box from '@material-ui/core/Box'
import Alert from '@material-ui/lab/Alert'

import Footer from 'components/Footer'
import { MainContainer } from 'containers'
import { evolutiondex } from 'utils'
import { ExchangeProvider } from 'context/exchange.context'

import BackLayer from './BackLayer'
import FrontLayer from './FrontLayer'
import Sidebar from './Sidebar'
import SubMenuTopBar from './SubmenuTopbar'
import Topbar from './Topbar'

const STATIC_PAGES = ['/faq', '/about', '/ricardian-contract']

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'relative',
    width: '100vw',
    overflowY: 'hidden'
  },
  backLayer: {
    overflowY: 'auto'
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
    borderBottomWidth: 0,
    overflowX: 'hidden'
  },
  rootDark: {
    background:
      'linear-gradient(180deg, rgba(11, 11, 51, 0.98) 2%, rgb(23, 23, 68) 31%, rgb(39, 40, 99) 100%)',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0)',
    borderBottomWidth: 0,
    overflowX: 'hidden'
  },
  labelBackdrop: {
    fontSize: 20.2,
    fontWeight: 600,
    letterSpacing: '0.25px',
    color: 'rgba(0, 0, 0, 0.6)'
  },
  headerBoxNone: {
    display: 'none'
  },
  alert: {
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    color: theme.palette.primary.contrastText,
    '& a': {
      color: theme.palette.primary.contrastText,
      lineBreak: 'anywhere'
    }
  },
  footer: {
    height: 54,
    backgroundColor: 'rgba(151, 151, 151, 0.06)',
    display: 'flex',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  }
}))

const Evodex = ({ ual }) => {
  const { t, i18n } = useTranslation('translations')
  const theme = useTheme()
  const classes = useStyles()
  const location = useLocation()
  const backdropRef = useRef()
  const [openSidebar, setOpenSidebar] = useState(false)
  const [title, setTitle] = useState('headerTitle')
  const [isLightMode, setIsLightMode] = useState(false)
  const [layerHeightUp, setLayerHeightUp] = useState(51)
  const [exgangeInfo, setExchangeInfo] = useState(null)
  const [isStaticPage, setIsStaticPage] = useState(false)
  const [message, setMessage] = useState()
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), {
    defaultMatches: true
  })

  const height = window.innerHeight

  const handleOnClickRow = () => {
    if (backdropRef?.current?.toggleOnClickMobile) {
      backdropRef.current.toggleOnClickMobile()
    }
  }

  const handleOnReload = async () => {
    setExchangeInfo((prevValue) => ({
      ...prevValue,
      loading: true
    }))

    const info = await evolutiondex.getInfo(ual)

    setExchangeInfo((prevValue) => ({
      ...prevValue,
      ...info,
      loading: false
    }))
  }

  useEffect(() => {
    handleOnReload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ual.activeUser])

  useEffect(() => {
    if (STATIC_PAGES.includes(location.pathname)) {
      setLayerHeightUp(isLandscape && height < 450 ? 150 : 270)
      setTitle('')
      setIsStaticPage(true)

      return
    }

    setIsStaticPage(false)

    if (isMobile) {
      setTitle('headerTitle')
      setLayerHeightUp(60)

      return
    }

    setLayerHeightUp(isLandscape && height < 450 ? 80 : 470)
    setTitle('headerTitle')
  }, [isMobile, location.pathname, isLandscape, height])

  useEffect(() => {
    if (STATIC_PAGES.includes(location.pathname)) {
      setTitle('')
    } else {
      setTitle('headerTitle')
    }
  }, [i18n.language, location.pathname])

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
            handleOnLogout={() => ual.logout()}
            handleOnLogin={() => ual.showModal()}
            onChangeDarkMode={setIsLightMode}
          />
        }
        sidebarContent={<Sidebar setOpenSidebar={setOpenSidebar} />}
      >
        <Backdrop
          ref={backdropRef}
          className={classes.backdrop}
          classes={{
            frontLayer: classes.frontLayerRoot,
            root: isLightMode ? classes.rootLight : classes.rootDark,
            backLayer: classes.backLayer,
            headerBox:
              isStaticPage || isMobile || (isLandscape && height < 450)
                ? classes.headerBox
                : classes.headerBoxNone
          }}
          backLayer={
            <>
              <BackLayer
                ual={ual}
                onReload={handleOnReload}
                pathname={location.pathname}
                isLightMode={isLightMode}
                showMessage={setMessage}
              />
              <Snackbar
                open={!!message}
                autoHideDuration={30000}
                onClose={() => setMessage(null)}
              >
                <Alert
                  onClose={() => setMessage(null)}
                  severity={message?.type}
                  className={classes?.alert}
                >
                  {message?.content}
                </Alert>
              </Snackbar>
            </>
          }
          frontLayer={
            <>
              <FrontLayer
                handleOnClickRow={handleOnClickRow}
                pathname={location.pathname}
                isMobile={isMobile}
                isActiveUser={Boolean(ual.activeUser)}
                handleOnLogin={() => ual.showModal()}
              />
              <Box className={classes.footer}>
                <Footer />
              </Box>
            </>
          }
          headerText={
            <Typography className={classes.labelBackdrop}>
              {t(title)}
            </Typography>
          }
          backgroundColor={isLightMode ? '#1976d2' : '#272863'}
          layerHeightUp={layerHeightUp}
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
