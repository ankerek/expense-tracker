import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'

interface GetIsOnlineQuery {
  isOnline: boolean
}

export interface GetIsOnlineProps {
  children: (result: QueryResult<GetIsOnlineQuery>) => React.ReactNode | null
}

export const getIsOnlineQuery = gql`
  query GetIsOnlineQuery {
    isOnline @client
  }
`

export class GetIsOnline extends React.Component<GetIsOnlineProps> {
  render() {
    const { children } = this.props
    return (
      <Query<GetIsOnlineQuery> query={getIsOnlineQuery}>
        {(...args) => children(...args)}
      </Query>
    )
  }
}
