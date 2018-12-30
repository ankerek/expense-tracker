import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'

export class PrivateRoute extends React.Component<RouteProps> {
  render() {
    const { component: Component, ...rest } = this.props
    const user: any = true
    return (
      <Route
        {...rest}
        render={props => (
          <GetCurrentUser>
            {({ data, loading }) => {
              if (loading) {
                return <span>loading...</span>
              }
              return data.getCurrentUser ? (
                <Component {...this.props} />
              ) : (
                <Redirect to="/signin" />
              )
            }}
          </GetCurrentUser>
        )}
      />
    )
  }
}
