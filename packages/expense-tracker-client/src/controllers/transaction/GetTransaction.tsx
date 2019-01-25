import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { RouteComponentProps, withRouter } from 'react-router'
import { GetTransactionQuery } from '@schema-types'
import { transactionFragment } from './fragments'

export const getTransactionQuery = gql`
  query GetTransactionQuery($id: ID!) {
    getTransaction(id: $id) {
      ...Transaction
    }
  }
  ${transactionFragment}
`

interface GetTransactionProps {
  children: (result: QueryResult<GetTransactionQuery>) => JSX.Element | null
}

class C extends React.Component<
  GetTransactionProps & RouteComponentProps<{ id: string }>
> {
  render() {
    const {
      children,
      match: { params },
    } = this.props

    return (
      <Query<GetTransactionQuery>
        query={getTransactionQuery}
        variables={{ id: params.id }}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}

export const GetTransaction = withRouter(C)
