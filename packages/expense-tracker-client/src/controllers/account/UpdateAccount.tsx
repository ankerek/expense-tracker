import React from 'react'
import { compose } from '@utils/compose'
import { RouteComponentProps, withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import {
  UpdateAccountMutation,
  UpdateAccountMutationVariables,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { SaveAccount } from './SaveAccount'

const updateAccountMutation = gql`
  mutation UpdateAccountMutation($id: ID!, $input: SaveAccountInput!) {
    updateAccount(id: $id, input: $input) {
      ...Account
    }
  }
  ${accountFragment}
`

const withVariables = <
  P extends RouteComponentProps<{ id: string }> & {
    variables: Partial<UpdateAccountMutationVariables>
  }
>(
  Component: React.ComponentType<P>
) =>
  class C extends React.Component<P> {
    render() {
      return (
        <Component
          {...this.props}
          variables={{ id: this.props.match.params.id }}
        />
      )
    }
  }

export const UpdateAccount = compose(
  withRouter,
  graphql<null, UpdateAccountMutation, UpdateAccountMutationVariables>(
    updateAccountMutation
  ),
  withVariables
)(SaveAccount)
