import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute } from '@core-components/PrivateRoute'
import { HomePage } from '@pages/HomePage'
import { SignInPage } from '@pages/SignInPage'
import { SignUpPage } from '@pages/SignUpPage'
import { NotFoundPage } from '@pages/NotFoundPage'

export const Routes = () => (
  <Router>
    <Switch>
      <Route path="/signin" component={SignInPage} />
      <Route path="/signup" component={SignUpPage} />

      <PrivateRoute path="/" exact component={HomePage} />

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
)
