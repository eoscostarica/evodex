export const commonStyles = (theme) => ({
  helpIcon: {
    color: '#ffffff',
    marginLeft: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer'
    }
  },
  helpText: {
    fontSize: 14.1,
    fontWeight: 600,
    letterSpacing: 1.25,
    lineHeight: 1.73,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer'
    }
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
    padding: theme.spacing(2, 0),
    '& svg': {
      color: '#fff',
      fontSize: 30,
      [theme.breakpoints.up('lg')]: {
        marginTop: 15
      }
    }
  },
  rocketSvg: {
    zIndex: 0,
    position: 'absolute',
    height: 260,
    right: '-10px',
    top: 0,
    [theme.breakpoints.up('md')]: {
      top: 62,
      height: 450,
      right: '-50px',
      opacity: 0.2
    }
  },
  btnExchange: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(3),
    '& button': {
      width: 162,
      height: 36
    }
  },
  titleBox: {
    width: 225,
    paddingLeft: theme.spacing(2),
    '& h4': {
      fontSize: 33,
      letterSpacing: '-0.49px',
      color: '#ffffff',
      fontWeight: 'bold'
    }
  },
  message: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    justifyContent: 'center',
    minWidth: '100%'
  },
  loading: {
    marginTop: theme.spacing(2),
    minWidth: '100%'
  },
  boxMessage: {
    marginTop: theme.spacing(2),
    display: 'flex',
    '& p': {
      marginRight: 5,
      fontSize: 12.1,
      fontWeight: '600',
      lineHeight: 1.32,
      letterSpacing: 0.4,
      color: 'rgba(0, 0, 0, 0.6)'
    }
  },
  link: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    }
  }
})
