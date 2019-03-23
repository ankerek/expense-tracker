import React from 'react'
import uuid from 'uuid/v4'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
  MutationOptions,
} from 'react-apollo'
import {
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  Transaction,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { transactionFragment } from './fragments'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { getUpdater } from '@controllers/getUpdater'
import { setLocalOperation } from '@controllers/network/localOperations'

export const DeleteTransactionMutationName = 'DeleteTransactionMutation'

const deleteTransactionMutation = gql`
  mutation DeleteTransactionMutation($id: ID!) {
    deleteTransaction(id: $id)
  }
`

interface DeleteTransactionProps {
  children: (
    deleteTransaction: () => void,
    data: {
      loading: boolean
    }
  ) => JSX.Element | null
}

const initialState = {
  loading: false,
}

type State = Readonly<typeof initialState>

class C extends React.Component<
  RouteComponentProps<{ id: string }> &
    ChildMutateProps<
      WithApolloClient<DeleteTransactionProps>,
      DeleteTransactionMutation,
      DeleteTransactionMutationVariables
    >
> {
  readonly state: State = initialState

  render() {
    return this.props.children(this.deleteTransaction, {
      loading: this.state.loading,
    })
  }

  private deleteTransaction = async () => {
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

    const prevTransaction: Transaction = client.readFragment({
      id: `Transaction:${id}`,
      fragment: transactionFragment,
      fragmentName: 'Transaction',
    })

    const updaterOtherOptions: any = {
      prevTransaction,
    }

    const mutationOptions: MutationOptions<
      DeleteTransactionMutation,
      DeleteTransactionMutationVariables
    > = {
      variables: { id },
      optimisticResponse: {
        deleteTransaction: true,
      },
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, updaterOtherOptions),
      context: {
        operationId,
        account: prevTransaction.account,
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
          mutation: deleteTransactionMutation,
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

export const DeleteTransaction = compose(
  withRouter,
  withApollo,
  graphql<
    DeleteTransactionProps,
    DeleteTransactionMutation,
    DeleteTransactionMutationVariables
  >(deleteTransactionMutation)
)(C)
