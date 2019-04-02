import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import {
  CategoryDeletedSubscription,
  CategorySavedSubscription,
  GetCategoryListQuery,
  GetTransactionListQuery,
} from '@schema-types'
import { categoryFragment } from './fragments'
import { client } from '@apollo/initializeApollo'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { GetCurrentUser } from '@controllers/user/GetCurrentUser'

export const getCategoryListQuery = gql`
  query GetCategoryListQuery {
    getCategoryList {
      ...Category
    }
  }
  ${categoryFragment}
`

const categorySavedSubscription = gql`
  subscription CategorySavedSubscription($userId: ID!) {
    categorySaved(userId: $userId) {
      ...Category
    }
  }
  ${categoryFragment}
`

const categoryDeletedSubscription = gql`
  subscription CategoryDeletedSubscription($userId: ID!) {
    categoryDeleted(userId: $userId)
  }
`

interface GetCategoryListProps {
  children: (
    result: QueryResult<GetCategoryListQuery> & { subscribe(): void }
  ) => JSX.Element | null
}

export class GetCategoryList extends React.Component<GetCategoryListProps> {
  render() {
    const { children } = this.props
    return (
      <GetCurrentUser>
        {({ data }) =>
          data &&
          data.getCurrentUser && (
            <Query<GetCategoryListQuery>
              query={getCategoryListQuery}
              fetchPolicy="cache-and-network"
            >
              {({ subscribeToMore, ...rest }) =>
                children({
                  ...rest,
                  subscribeToMore,
                  subscribe: () => {
                    // subscribe to new or updated categories
                    subscribeToMore<CategorySavedSubscription>({
                      document: categorySavedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const newCategory = subscriptionData.data.categorySaved

                        let newCategoryList = prev.getCategoryList

                        const newCategoryIdx = newCategoryList.findIndex(
                          category => category.id === newCategory.id
                        )

                        if (newCategoryIdx === -1) {
                          newCategoryList = [...newCategoryList, newCategory]
                        } else {
                          newCategoryList = [
                            ...newCategoryList.slice(0, newCategoryIdx),
                            newCategory,
                            ...newCategoryList.slice(newCategoryIdx + 1),
                          ]
                        }

                        return {
                          ...prev,
                          getCategoryList: newCategoryList,
                        }
                      },
                    })

                    // subscribe to deleted categorys
                    subscribeToMore<CategoryDeletedSubscription>({
                      document: categoryDeletedSubscription,
                      variables: { userId: data.getCurrentUser.id },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev
                        }

                        const categoryList = prev.getCategoryList

                        const categoryIdx = prev.getCategoryList.findIndex(
                          category =>
                            category.id ===
                            subscriptionData.data.categoryDeleted
                        )

                        if (categoryIdx === -1) {
                          return prev
                        }

                        // remove transactions associated to the category from the transaction list
                        const transactionsData: GetTransactionListQuery = client.readQuery(
                          {
                            query: getTransactionListQuery,
                          }
                        )
                        transactionsData.getTransactionList = transactionsData.getTransactionList.filter(
                          t =>
                            t.category.id !==
                            subscriptionData.data.categoryDeleted
                        )
                        client.writeQuery({
                          query: getTransactionListQuery,
                          data: transactionsData,
                        })

                        return {
                          ...prev,
                          getCategoryList: [
                            ...categoryList.slice(0, categoryIdx),
                            ...categoryList.slice(categoryIdx + 1),
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
