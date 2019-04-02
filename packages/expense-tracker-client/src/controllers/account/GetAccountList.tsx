import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import {
  AccountSavedSubscription,
  GetAccountListQuery,
  AccountDeletedSubscription,
  GetTransactionListQuery,
} from '@schema-types'
import { accountFragment } from './fragments'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'
import { client } from '@apollo/initializeApollo'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'

export const getAccountListQuery = gql`
  query GetAccountListQuery {
    getAccountList {
      ...Account
    }
  }
  ${accountFragment}
`

const accountSavedSubscription = gql`
  subscription AccountSavedSubscription($userId: ID!) {
    accountSaved(userId: $userId) {
      ...Account
    }
  }
  ${accountFragment}
`

const accountDeletedSubscription = gql`
  subscription AccountDeletedSubscription($userId: ID!) {
    accountDeleted(userId: $userId)
  }
`

interface GetAccountListProps {
  children: (
    result: QueryResult<GetAccountListQuery> & { subscribe(): void }
  ) => JSX.Element | null
}

export class GetAccountList extends React.Component<GetAccountListProps> {
  render() {
    const { children } = this.props
    return (
      <GetCurrentUser>
        {({ data }) =>
          data &&
          data.getCurrentUser && (
            <Query<GetAccountListQuery>
              query={getAccountListQuery}
              fetchPolicy="cache-and-network"
            >
              {({ subscribeToMore, ...rest }) =>
                children({
                  ...rest,
                  subscribeToMore,
                  subscribe: () => {
                    // subscribe to new or updated accounts
                    subscribeToMore<AccountSavedSubscription>({
                      document: accountSavedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const newAccount = subscriptionData.data.accountSaved

                        let newAccountList = prev.getAccountList

                        const newAccountIdx = newAccountList.findIndex(
                          account => account.id === newAccount.id
                        )

                        if (newAccountIdx === -1) {
                          newAccountList = [...newAccountList, newAccount]
                        } else {
                          newAccountList = [
                            ...newAccountList.slice(0, newAccountIdx),
                            newAccount,
                            ...newAccountList.slice(newAccountIdx + 1),
                          ]
                        }

                        return {
                          ...prev,
                          getAccountList: newAccountList,
                        }
                      },
                    })

                    // subscribe to deleted accounts
                    subscribeToMore<AccountDeletedSubscription>({
                      document: accountDeletedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const accountList = prev.getAccountList

                        const accountIdx = prev.getAccountList.findIndex(
                          account =>
                            account.id === subscriptionData.data.accountDeleted
                        )

                        if (accountIdx === -1) {
                          return prev
                        }

                        // remove transactions associated to the account from the transaction list
                        const transactionsData: GetTransactionListQuery = client.readQuery(
                          {
                            query: getTransactionListQuery,
                          }
                        )
                        transactionsData.getTransactionList = transactionsData.getTransactionList.filter(
                          t =>
                            t.account.id !==
                            subscriptionData.data.accountDeleted
                        )
                        client.writeQuery({
                          query: getTransactionListQuery,
                          data: transactionsData,
                        })

                        return {
                          ...prev,
                          getAccountList: [
                            ...accountList.slice(0, accountIdx),
                            ...accountList.slice(accountIdx + 1),
                          ],
                        }
                      },
                    })
                  },
                })
              }
            </Query>
          )
        }
      </GetCurrentUser>
    )
  }
}
