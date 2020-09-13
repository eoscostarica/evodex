import React from 'react'
import { render } from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

import ual from './ual'
import App from './App'
import theme from './theme'
import * as serviceWorker from './serviceWorker'
import './i18n'

const init = async () => {
  const AppWithUAL = withUAL(App)
  await ual.init()

  render(
    <UALProvider
      chains={ual.chains}
      authenticators={ual.authenticators}
      appName={ual.appName}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppWithUAL />
      </ThemeProvider>
    </UALProvider>,
    document.getElementById('root')
  )
}

init()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
