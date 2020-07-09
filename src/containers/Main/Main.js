import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import EvodexLogo from '../../components/Icons/EvodexLogo'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    display: 'flex'
  },
  appBar: {
    boxShadow: 'none',
    backgroundColor: '#1976d2',
    color: '#fff !important'
  },
  drawer: {
    width: 0,
    transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  drawerDesktop: {
    width: 240
  },
  drawerPaper: {
    width: 240
  },
  drawerToggle: {
    marginLeft: -12
  },
  drawerContent: {
    backgroundColor: theme.palette.white,
    height: '100%',
    padding: theme.spacing(2)
  },
  logo: {
    height: 25
  }
}))

const Main = ({ children, sidebarContent, topbarContent }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })

  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <Container component="main" maxWidth="xl" className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpenSidebar(!openSidebar)}
            className={classes.drawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <RouterLink to="/">
            <EvodexLogo classes={classes.logo} />
          </RouterLink>
          {topbarContent}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
        onClose={() => setOpenSidebar(false)}
        open={openSidebar}
        variant="temporary"
        className={clsx(classes.drawer, {
          [classes.drawerDesktop]: isDesktop && openSidebar
        })}
      >
        <div className={classes.drawerContent}>{sidebarContent}</div>
      </Drawer>
      {children}
    </Container>
  )
}

Main.propTypes = {
  children: PropTypes.node,
  sidebarContent: PropTypes.node,
  topbarContent: PropTypes.node
}

export default Main
