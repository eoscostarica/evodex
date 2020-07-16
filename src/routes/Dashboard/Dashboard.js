import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import DashboardActions from './DashboardActions'

const Dashboard = ({ ual }) => (
  <Grid container>
    <Switch>
      <Route
        exact
        path="/dashboard/actions"
        render={() => <DashboardActions ual={ual} />}
      />
      <Redirect from="/dashboard" to="/dashboard/actions" />
    </Switch>
  </Grid>
)

Dashboard.propTypes = {
  ual: PropTypes.object
}

Dashboard.defaultProps = {
  ual: {}
}

export default Dashboard
