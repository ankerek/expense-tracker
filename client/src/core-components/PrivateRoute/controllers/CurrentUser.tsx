import * as React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from "react-apollo";
import { CurrentUserQuery } from '@schema-types'

const currentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      email
    }
  }
`

interface CurrentUserProps {
  children: (
    result: QueryResult<CurrentUserQuery>
  ) => JSX.Element | null
}

export class CurrentUser extends React.Component<CurrentUserProps> {
  render() {
    const { children } = this.props
    return (
      <Query<CurrentUserQuery>
        query={currentUserQuery}
        fetchPolicy='cache-and-network'
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
