// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import NeedAuth from './components/NeedAuth'
import AuthRoute from './components/AuthRoute'
import UnAuthRoute from './components/UnAuthRoute'
import UserDashboard from './containers/UserDashboard'
import AppNavbar from './containers/AppNavbar';

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
          <AppNavbar />
          <Switch>
            <UnAuthRoute path="/need-auth">
              <NeedAuth />
            </UnAuthRoute>
            <AuthRoute exact path="/">
              <UserDashboard />
            </AuthRoute>
          </Switch>
        </Router>
    </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root