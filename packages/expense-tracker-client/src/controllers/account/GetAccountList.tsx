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

interface GetAccountListProps {
  children: (result: QueryResult<GetAccountListQuery>) => JSX.Element | null
}

export class GetAccountList extends React.Component<GetAccountListProps> {
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
