import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { GetCategoryListQuery } from '@schema-types'
import { categoryFragment } from './fragments'

export const getCategoryListQuery = gql`
  query GetCategoryListQuery {
    getCategoryList {
      ...Category
    }
  }
  ${categoryFragment}
`

interface GetCategoryListProps {
  children: (result: QueryResult<GetCategoryListQuery>) => JSX.Element | null
}

export class GetCategoryList extends React.Component<GetCategoryListProps> {
  render() {
    const { children } = this.props
    return (
      <Query<GetCategoryListQuery>
        query={getCategoryListQuery}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}
