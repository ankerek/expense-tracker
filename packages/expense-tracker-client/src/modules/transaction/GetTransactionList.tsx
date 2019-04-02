import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import {
  GetTransactionListQuery,
  TransactionDeletedSubscription,
  TransactionSavedSubscription,
} from '@schema-types'
import { transactionFragment } from './fragments'
import { FetchPolicy } from 'apollo-client'
import { GetCurrentUser } from '@modules/user/GetCurrentUser'

export const getTransactionListQuery = gql`
  query GetTransactionListQuery {
    getTransactionList {
      ...Transaction
    }
  }
  ${transactionFragment}
`

const transactionSavedSubscription = gql`
  subscription TransactionSavedSubscription($userId: ID!) {
    transactionSaved(userId: $userId) {
      ...Transaction
    }
  }
  ${transactionFragment}
`

const transactionDeletedSubscription = gql`
  subscription TransactionDeletedSubscription($userId: ID!) {
    transactionDeleted(userId: $userId)
  }
`

interface GetTransactionListProps {
  fetchPolicy?: FetchPolicy
  children: (
    result: QueryResult<GetTransactionListQuery> & { subscribe(): void }
  ) => JSX.Element | null
}

export class GetTransactionList extends React.Component<
  GetTransactionListProps
> {
  render() {
    const { fetchPolicy = 'cache-and-network', children } = this.props
    return (
      <GetCurrentUser>
        {({ data }) =>
          data &&
          data.getCurrentUser && (
            <Query<GetTransactionListQuery>
              query={getTransactionListQuery}
              fetchPolicy={fetchPolicy}
            >
              {({ subscribeToMore, ...rest }) =>
                children({
                  ...rest,
                  subscribeToMore,
                  subscribe: () => {
                    // subscribe to new or updated transactions
                    subscribeToMore<TransactionSavedSubscription>({
                      document: transactionSavedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const newTransaction =
                          subscriptionData.data.transactionSaved

                        let newTransactionList = prev.getTransactionList

                        const newTransactionIdx = newTransactionList.findIndex(
                          transaction => transaction.id === newTransaction.id
                        )

                        if (newTransactionIdx === -1) {
                          newTransactionList = [
                            ...newTransactionList,
                            newTransaction,
                          ]
                        } else {
                          newTransactionList = [
                            ...newTransactionList.slice(0, newTransactionIdx),
                            newTransaction,
                            ...newTransactionList.slice(newTransactionIdx + 1),
                          ]
                        }

                        return {
                          ...prev,
                          getTransactionList: newTransactionList,
                        }
                      },
                    })

                    // subscribe to deleted transactions
                    subscribeToMore<TransactionDeletedSubscription>({
                      document: transactionDeletedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const transactionList = prev.getTransactionList

                        const transactionIdx = prev.getTransactionList.findIndex(
                          transaction =>
                            transaction.id ===
                            subscriptionData.data.transactionDeleted
                        )

                        if (transactionIdx === -1) {
                          return prev
                        }

                        return {
                          ...prev,
                          getTransactionList: [
                            ...transactionList.slice(0, transactionIdx),
                            ...transactionList.slice(transactionIdx + 1),
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
