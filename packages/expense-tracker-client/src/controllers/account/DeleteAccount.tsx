import React from 'react'
import uuid from 'uuid/v4'
import gql from 'graphql-tag'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  Account,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { accountFragment } from '@controllers/account/fragments'
import { getUpdater } from '@controllers/getUpdater'
import { setLocalOperation } from '@controllers/network/localOperations'

export const DeleteAccountMutationName = 'DeleteAccountMutation'

const deleteAccountMutation = gql`
  mutation DeleteAccountMutation($id: ID!) {
    deleteAccount(id: $id)
  }
`

interface DeleteAccountProps {
  children: (
    deleteAccount: () => void,
    data: {
      loading: boolean
    }
  ) => JSX.Element | null
}

const initialState = {
  loading: false,
}

class C extends React.Component<
  RouteComponentProps<{ id: string }> &
    ChildMutateProps<
      WithApolloClient<DeleteAccountProps>,
      DeleteAccountMutation,
      DeleteAccountMutationVariables
    >
> {
  readonly state: Readonly<typeof initialState> = initialState

  render() {
    return this.props.children(this.deleteAccount, {
      loading: this.state.loading,
    })
  }

  private deleteAccount = async () => {
    const {
      client,
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props
    const operationId = uuid()

    this.setState({ loading: true })

    const prevAccount: Account = client.readFragment({
      id: `Account:${id}`,
      fragment: accountFragment,
      fragmentName: 'Account',
    })

    const updaterOtherOptions: any = {
      prevAccount,
    }

    const mutationOptions: MutationOptions<
      DeleteAccountMutation,
      DeleteAccountMutationVariables
    > = {
      variables: { id },
      optimisticResponse: {
        deleteAccount: true,
      },
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, updaterOtherOptions),
      context: {
        operationId,
      },
    }

    const { isOnline } = client.readQuery({
      query: getIsOnlineQuery,
    })

    if (isOnline) {
      await mutate(mutationOptions)
    } else {
      mutate(mutationOptions)

      setLocalOperation({
        mutationOptions: {
          ...mutationOptions,
          mutation: deleteAccountMutation,
        },
        updaterOtherOptions,
      })
    }

    this.setState({ loading: false })

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
