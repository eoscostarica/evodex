import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

import HelmetMetaData from 'components/PageTitle'

import routes from './routes'
import ual from './ual'

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

const AppWrapper = () => {
  const AppWithUAL = withUAL(App)
  const [ualConfig, setUalConfig] = useState(null)

  useEffect(() => {
    const init = async () => {
      await ual.init()
      setUalConfig(ual)
    }

    init()
  }, [])

  return (
    <>
      {!ualConfig && 'Loading...'}
      {ualConfig && (
        <UALProvider
          chains={ualConfig.chains}
          authenticators={ualConfig.authenticators}
          appName={ualConfig.appName}
        >
          <AppWithUAL />
        </UALProvider>
      )}
    </>
  )
}

export default AppWrapper
