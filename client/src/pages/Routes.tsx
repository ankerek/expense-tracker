import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LoginPage } from '@pages/LoginPage'
import { SignUpPage } from '@pages/SignUpPage'

export const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignUpPage} />
    </Switch>
  </Router>
)
