import React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
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
    data: {
      deleteAccount: () => void
    }
  ) => JSX.Element | null
}

class C extends React.Component<
  RouteComponentProps<{ id: string }> &
    ChildMutateProps<
      WithApolloClient<DeleteAccountProps>,
      DeleteAccountMutation,
      DeleteAccountMutationVariables
    >
> {
  render() {
    return this.props.children({ deleteAccount: this.deleteAccount })
  }

  private deleteAccount = async () => {
    const {
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props

    await mutate({
      variables: { id },
    })

    if (state && state.next) {
      history.push(state.next)
    } else {
      history.push('/')
    }
  }
}

export const DeleteAccount = compose(
  withRouter,
  withApollo,
  graphql<
    DeleteAccountProps,
    DeleteAccountMutation,
    DeleteAccountMutationVariables
  >(deleteAccountMutation)
)(C)
