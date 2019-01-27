import React from 'react'
import gql from 'graphql-tag'
import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import {
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'

export const DeleteAccountMutationName = 'DeleteAccountMutation'

const deleteAccountMutation = gql`
  mutation DeleteAccountMutation($id: ID!) {
    deleteAccount(id: $id)
  }
`

interface DeleteAccountProps {
  children: (
    mutateFn: MutationFn<DeleteAccountMutation, DeleteAccountMutationVariables>,
    result: MutationResult<DeleteAccountMutation>
  ) => JSX.Element | null
}

class C extends React.Component<
  DeleteAccountProps & RouteComponentProps<{ id: string }>
> {
  render() {
    const {
      children,
      history,
      location: { state },
      match: {
        params: { id },
      },
    } = this.props

    return (
      <Mutation<DeleteAccountMutation, DeleteAccountMutationVariables>
        mutation={deleteAccountMutation}
        variables={{ id }}
        onCompleted={() => {
          if (state && state.next) {
            history.push(state.next)
          } else {
            history.push('/')
          }
        }}
      >
        {(...args) => children(...args)}
      </Mutation>
    )
  }
}

export const DeleteAccount = compose(withRouter)(C)
