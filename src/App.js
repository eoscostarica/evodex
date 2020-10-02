import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import HelmetMetaData from 'components/PageTitle'

import routes from './routes'

const App = ({ ual }) => (
  <BrowserRouter>
    <HelmetMetaData />
    <Switch>
      {routes.map(({ path, component: Component }) => (
        <Route key={`path-${path}`} path={path}>
          <Component ual={ual} />
        </Route>
      ))}
      <Redirect to="/not-found" />
    </Switch>
  </BrowserRouter>
)

App.propTypes = {
  ual: PropTypes.object
}

export default App
