import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { CurrentUser } from '@core-components/PrivateRoute/controllers/CurrentUser'

export class PrivateRoute extends React.Component<RouteProps> {
  render() {
    const { component: Component, ...rest } = this.props
    const user: any = true
    return (
      <Route
        {...rest}
        render={props => (
          <CurrentUser>
            {({ data, loading }) => {
              if (loading) {
                return <span>loading...</span>
              }

              return data.currentUser ? (
                <Component {...this.props} />
              ) : (
                <Redirect to="/signin" />
              )
            }}
          </CurrentUser>
        )}
      />
    )
  }
}
