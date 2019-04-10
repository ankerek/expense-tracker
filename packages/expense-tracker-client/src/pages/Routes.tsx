import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PrivateRoute } from '@components/PrivateRoute'
import { OverviewPage } from '@pages/OverviewPage'
import { SignInPage } from '@pages/SignInPage'
import { SignUpPage } from '@pages/SignUpPage'
import { SignOutPage } from '@pages/SignOutPage'
import { AccountsPage } from '@pages/AccountsPage'
import { CreateAccountPage } from '@pages/CreateAccountPage'
import { AccountPage } from '@pages/AccountPage'
import { CategoriesPage } from '@pages/CategoriesPage'
import { CreateCategoryPage } from '@pages/CreateCategoryPage'
import { CategoryPage } from '@pages/CategoryPage'
import { TransactionsPage } from '@pages/TransactionsPage'
import { CreateTransactionPage } from '@pages/CreateTransactionPage'
import { TransactionPage } from '@pages/TransactionPage'
import { NotFoundPage } from '@pages/NotFoundPage'

export const Routes = () => (
  <Switch>
    <Route path="/signin" component={SignInPage} />
    <Route path="/signup" component={SignUpPage} />

    <PrivateRoute path="/signout" exact component={SignOutPage} />
    <PrivateRoute path="/" exact component={OverviewPage} />
    <PrivateRoute path="/accounts" exact component={AccountsPage} />
    <PrivateRoute path="/accounts/create" exact component={CreateAccountPage} />
    <PrivateRoute path="/accounts/:id" exact component={AccountPage} />
    <PrivateRoute path="/categories" exact component={CategoriesPage} />
    <PrivateRoute
      path="/categories/create"
      exact
      component={CreateCategoryPage}
    />
    <PrivateRoute path="/categories/:id" exact component={CategoryPage} />
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
