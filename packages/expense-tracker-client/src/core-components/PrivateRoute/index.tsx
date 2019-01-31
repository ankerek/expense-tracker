import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'

export class PrivateRoute extends React.Component<RouteProps> {
  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={() => (
          <GetCurrentUser fetchPolicy="network-only">
            {({ data, loading }) => {
              if (data && data.getCurrentUser) {
                return <Component {...this.props} />
              }

              if (loading) {
                return <span>loading...</span>
              }

              return <Redirect to="/signin" />
            }}
          </GetCurrentUser>
        )}
      />
    )
  }
}
