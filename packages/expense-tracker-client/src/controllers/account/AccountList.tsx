import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetAccountListQuery } from '@schema-types'
import { accountFragment } from './fragments'

export const getAccountListQuery = gql`
  query GetAccountListQuery {
    getAccountList {
      ...Account
    }
  }
  ${accountFragment}
`

interface AccountListProps {
  children: (result: QueryResult<GetAccountListQuery>) => JSX.Element | null
}

export class GetAccountList extends React.Component<AccountListProps> {
  render() {
    const { children } = this.props
    return (
      <Query<GetAccountListQuery>
        query={getAccountListQuery}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
