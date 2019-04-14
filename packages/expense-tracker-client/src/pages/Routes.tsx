import React, { Suspense, lazy, LazyExoticComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { PrivateRoute } from '@components/PrivateRoute'
import { PageLayout } from '@components/PageLayout'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box } from '@components/Box'

function lazyRouteFactory<C extends React.ComponentType>(
  importFn: () => Promise<{ default: C }>
) {
  const Component = lazy(importFn)
  return (props: any) => (
    <Suspense
      fallback={
        <PageLayout>
          <Box width="100%" height="100%" centerAll={true}>
            <CircularProgress color="secondary" />
          </Box>
        </PageLayout>
      }
    >
      <Component {...props} />
    </Suspense>
  )
}

const SignInPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'SignInPage', webpackPrefetch: true */ '@pages/SignInPage')
)

const SignUpPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'SignUpPage', webpackPrefetch: true */ '@pages/SignUpPage')
)

const OverviewPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'OverviewPage', webpackPrefetch: true */ '@pages/OverviewPage')
)

const SignOutPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'SignOutPage', webpackPrefetch: true */ '@pages/SignOutPage')
)

const AccountsPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'AccountsPage', webpackPrefetch: true */ '@pages/AccountsPage')
)

const CreateAccountPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'CreateAccountPage', webpackPrefetch: true */ '@pages/CreateAccountPage')
)

const AccountPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'AccountPage', webpackPrefetch: true */ '@pages/AccountPage')
)

const CategoriesPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'CategoriesPage', webpackPrefetch: true */ '@pages/CategoriesPage')
)

const CreateCategoryPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'CreateCategoryPage', webpackPrefetch: true */ '@pages/CreateCategoryPage')
)

const CategoryPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'CategoryPage', webpackPrefetch: true */ '@pages/CategoryPage')
)

const TransactionsPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'TransactionsPage', webpackPrefetch: true */ '@pages/TransactionsPage')
)

const CreateTransactionPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'CreateTransactionPage', webpackPrefetch: true */ '@pages/CreateTransactionPage')
)

const TransactionPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'TransactionPage', webpackPrefetch: true */ '@pages/TransactionPage')
)

const NotFoundPage = lazyRouteFactory(() =>
  import(/* webpackChunkName: 'NotFoundPage', webpackPrefetch: true */ '@pages/NotFoundPage')
)

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
