import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PrivateRoute } from '@core-components/PrivateRoute'
import { HomePage } from '@pages/HomePage'
import { SignInPage } from '@pages/SignInPage'
import { SignUpPage } from '@pages/SignUpPage'
import { SignOutPage } from '@pages/SignOutPage'
import { AccountsPage } from '@pages/AccountsPage'
import { CreateAccountPage } from '@pages/CreateAccountPage'
import { AccountPage } from '@pages/AccountPage'
import { TransactionsPage } from '@pages/TransactionsPage'
import { CreateTransactionPage } from '@pages/CreateTransactionPage'
import { TransactionPage } from '@pages/TransactionPage'
import { NotFoundPage } from '@pages/NotFoundPage'

export const Routes = () => (
  <Switch>
    <Route path="/signin" component={SignInPage} />
    <Route path="/signup" component={SignUpPage} />

    <PrivateRoute path="/signout" exact component={SignOutPage} />
    <PrivateRoute path="/" exact component={HomePage} />
    <PrivateRoute path="/accounts" exact component={AccountsPage} />
    <PrivateRoute path="/accounts/create" exact component={CreateAccountPage} />
    <PrivateRoute path="/accounts/:id" exact component={AccountPage} />
    <PrivateRoute path="/transactions" exact component={TransactionsPage} />
    <PrivateRoute
      path="/transactions/create"
      exact
      component={CreateTransactionPage}
    />
    <PrivateRoute path="/transactions/:id" exact component={TransactionPage} />

    <Route component={NotFoundPage} />
  </Switch>
)
