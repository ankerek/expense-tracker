import React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import { RouteComponentProps, withRouter } from 'react-router'
import { GetCategoryQuery } from '@schema-types'
import { categoryFragment } from './fragments'

export const getCategoryQuery = gql`
  query GetCategoryQuery($id: ID!) {
    getCategory(id: $id) {
      ...Category
    }
  }
  ${categoryFragment}
`

interface GetCategoryProps {
  children: (result: QueryResult<GetCategoryQuery>) => JSX.Element | null
}

class C extends React.Component<
  GetCategoryProps & RouteComponentProps<{ id: string }>
> {
  render() {
    const {
      children,
      match: { params },
    } = this.props

    return (
      <Query<GetCategoryQuery>
        query={getCategoryQuery}
        variables={{ id: params.id }}
        fetchPolicy="cache-and-network"
      >
        {(...args) => children(...args)}
      </Query>
    )
  }
}

export const GetCategory = withRouter(C)
