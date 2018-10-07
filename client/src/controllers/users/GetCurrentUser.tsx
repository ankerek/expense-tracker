import * as React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetCurrentUserQuery } from '@schema-types'
import { userFragment } from './fragments'

export const getCurrentUserQuery = gql`
  query GetCurrentUserQuery {
    getCurrentUser {
      ...user
    }
  }
  ${userFragment}
`

interface CurrentUserProps {
  children: (result: QueryResult<GetCurrentUserQuery>) => JSX.Element | null
}

export class GetCurrentUser extends React.Component<CurrentUserProps> {
  render() {
    const { children } = this.props
    return (
      <Query<GetCurrentUserQuery>
        query={getCurrentUserQuery}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
