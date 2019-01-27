import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { FetchPolicy } from 'apollo-client'
import { GetCurrentUserQuery } from '@schema-types'
import { userFragment } from './fragments'

export const getCurrentUserQuery = gql`
  query GetCurrentUserQuery {
    getCurrentUser {
      ...User
    }
  }
  ${userFragment}
`

interface CurrentUserProps {
  fetchPolicy?: FetchPolicy
  children: (result: QueryResult<GetCurrentUserQuery>) => React.ReactNode | null
}

export class GetCurrentUser extends React.Component<CurrentUserProps> {
  render() {
    const { fetchPolicy = 'cache-and-network', children } = this.props
    return (
      <Query<GetCurrentUserQuery>
        query={getCurrentUserQuery}
        fetchPolicy={fetchPolicy}
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
