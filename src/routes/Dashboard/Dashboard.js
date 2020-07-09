import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { MainContainer } from '../../containers'

import DashboardSidebar from './DashboardSidebar'
import DashboardTopbar from './DashboardTopbar'
import DashboardProducts from './DashboardProducts'
import DashboardUsers from './DashboardUsers'
import DashboardActions from './DashboardActions'

const Dashboard = ({ ual }) => (
  <MainContainer
    topbarContent={
      <DashboardTopbar
        user={ual.activeUser}
        onLogout={() => ual.logout()}
        onLogin={() => ual.showModal()}
      />
    }
    sidebarContent={
      <DashboardSidebar
        user={ual.activeUser}
        onLogout={() => ual.logout()}
        onLogin={() => ual.showModal()}
      />
    }
  >
    <Grid container>
      <Switch>
        <Route exact path="/dashboard/products" component={DashboardProducts} />
        <Route exact path="/dashboard/users" component={DashboardUsers} />
        <Route
          exact
          path="/dashboard/add-liquidity"
          render={() => <DashboardActions ual={ual} />}
        />
        <Redirect from="/dashboard" to="/dashboard/products" />
      </Switch>
    </Grid>
  </MainContainer>
)

Dashboard.propTypes = {
  ual: PropTypes.object
}

Dashboard.defaultProps = {
  ual: {}
}

export default Dashboard
