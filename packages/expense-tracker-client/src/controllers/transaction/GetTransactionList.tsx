import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetTransactionListQuery } from '@schema-types'
import { transactionFragment } from './fragments'

export const getTransactionListQuery = gql`
  query GetTransactionListQuery {
    getTransactionList {
      ...transaction
    }
  }
  ${transactionFragment}
`

interface GetTransactionListProps {
  children: (result: QueryResult<GetTransactionListQuery>) => JSX.Element | null
}

export class GetTransactionList extends React.Component<
  GetTransactionListProps
> {
  render() {
    const { children } = this.props
    return (
      <Query<GetTransactionListQuery>
        query={getTransactionListQuery}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
