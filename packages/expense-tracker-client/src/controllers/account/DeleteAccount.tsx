import React from 'react'
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
  GetAccountListQuery,
  GetTransactionListQuery,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { getAccountListQuery } from '@controllers/account/GetAccountList'

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

    this.setState({ loading: true })

    const mutationOptions: MutationOptions<
      DeleteAccountMutation,
      DeleteAccountMutationVariables
    > = {
      variables: { id },
      optimisticResponse: {
        deleteAccount: true,
      },
      update: () => {
        // remove the account from the account list
        const accountsData: GetAccountListQuery = client.readQuery({
          query: getAccountListQuery,
        })
        accountsData.getAccountList = accountsData.getAccountList.filter(
          a => a.id !== id
        )
        client.writeQuery({
          query: getAccountListQuery,
          data: accountsData,
        })

        // remove transactions associated to the account from the transaction list
        const transactionsData: GetTransactionListQuery = client.readQuery({
          query: getTransactionListQuery,
        })
        transactionsData.getTransactionList = transactionsData.getTransactionList.filter(
          t => t.account.id !== id
        )
        client.writeQuery({
          query: getTransactionListQuery,
          data: transactionsData,
        })
      },
    }

    const { isOnline } = client.readQuery({
      query: getIsOnlineQuery,
    })

    if (isOnline) {
      await mutate(mutationOptions)
    } else {
      mutate(mutationOptions)
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
