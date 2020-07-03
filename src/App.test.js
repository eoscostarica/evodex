import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
