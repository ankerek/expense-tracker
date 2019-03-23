import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import { GetIsOnline } from '@controllers/network/GetIsOnline'

export class PrivateRoute extends React.Component<RouteProps> {
  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={() => (
          <GetIsOnline>
            {({ data: { isOnline } }) => (
              <GetCurrentUser
                fetchPolicy={isOnline ? 'network-only' : 'cache-first'}
              >
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
          </GetIsOnline>
        )}
      />
    )
  }
}
