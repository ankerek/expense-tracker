import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetTransactionListQuery } from '@schema-types'
import { transactionFragment } from './fragments'
import { FetchPolicy } from 'apollo-client'

export const getTransactionListQuery = gql`
  query GetTransactionListQuery {
    getTransactionList {
      ...Transaction
    }
  }
  ${transactionFragment}
`

interface GetTransactionListProps {
  fetchPolicy?: FetchPolicy
  children: (result: QueryResult<GetTransactionListQuery>) => JSX.Element | null
}

export class GetTransactionList extends React.Component<
  GetTransactionListProps
> {
  render() {
    const { fetchPolicy = 'cache-and-network', children } = this.props
    return (
      <Query<GetTransactionListQuery>
        query={getTransactionListQuery}
        fetchPolicy={fetchPolicy}
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
