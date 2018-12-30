import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { RouteComponentProps, withRouter } from 'react-router'
import { GetAccountQuery } from '@schema-types'
import { accountFragment } from './fragments'

export const getAccountQuery = gql`
  query GetAccountQuery($id: ID!) {
    getAccount(id: $id) {
      ...account
    }
  }
  ${accountFragment}
`

interface GetAccountProps {
  children: (result: QueryResult<GetAccountQuery>) => JSX.Element | null
}

class C extends React.Component<
  GetAccountProps & RouteComponentProps<{ id: string }>
> {
  render() {
    const {
      children,
      match: { params },
    } = this.props

    return (
      <Query<GetAccountQuery>
        query={getAccountQuery}
        variables={{ id: params.id }}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}

export const GetAccount = withRouter(C)
