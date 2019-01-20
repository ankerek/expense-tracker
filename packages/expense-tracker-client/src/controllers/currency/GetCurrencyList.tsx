import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetCurrencyListQuery } from '@schema-types'
import { currencyFragment } from './fragments'

export const getCurrencyListQuery = gql`
  query GetCurrencyListQuery {
    getCurrencyList {
      ...currency
    }
  }
  ${currencyFragment}
`

interface GetCurrencyListProps {
  children: (result: QueryResult<GetCurrencyListQuery>) => JSX.Element | null
}

export class GetCurrencyList extends React.Component<GetCurrencyListProps> {
  render() {
    const { children } = this.props
    return (
      <Query<GetCurrencyListQuery> query={getCurrencyListQuery}>
        {(...args) => children(...args)}
      </Query>
    )
  }
}
