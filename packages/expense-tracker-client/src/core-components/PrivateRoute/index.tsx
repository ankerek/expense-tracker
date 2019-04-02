import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'
import { GetIsOnline, getIsOnlineQuery } from '@modules/network/GetIsOnline'
import { client } from '@apollo/initializeApollo'
import { restoreLocalOperations } from '@modules/network/localOperations'
import { getAccountListQuery } from '@modules/account/GetAccountList'
import { getCategoryListQuery } from '@modules/category/GetCategoryList'
import { getTransactionListQuery } from '@modules/transaction/GetTransactionList'
import { offlineLink } from '@apollo/links/offlineLink'

class InitActions extends React.Component {
  async componentDidMount() {
    const isOnlineData = client.readQuery({ query: getIsOnlineQuery })
    if (!isOnlineData.isOnline) {
      offlineLink.close()
    }

    await Promise.all([
      client.query({
        query: getAccountListQuery,
        fetchPolicy: 'network-only',
      }),
      client.query({
        query: getCategoryListQuery,
        fetchPolicy: 'network-only',
      }),
      client.query({
        query: getTransactionListQuery,
        fetchPolicy: 'network-only',
      }),
    ])

    restoreLocalOperations()
  }

  render() {
    return this.props.children
  }
}

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
                    return (
                      <InitActions>
                        <Component {...this.props} />
                      </InitActions>
                    )
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
