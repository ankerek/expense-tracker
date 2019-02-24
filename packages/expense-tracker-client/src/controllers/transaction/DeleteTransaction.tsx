import React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
  MutationOptions,
} from 'react-apollo'
import {
  Account,
  GetTransactionListQuery,
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  Transaction,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { sum } from '@utils/math'
import { transactionFragment } from './fragments'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { accountFragment } from '@controllers/account/fragments'

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
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props

    this.setState({ loading: true })

    const mutationOptions: MutationOptions<
      DeleteTransactionMutation,
      DeleteTransactionMutationVariables
    > = {
      variables: { id },
      optimisticResponse: {
        deleteTransaction: true,
      },
      update: client => {
        // remove the transaction from the Transaction list
        const data: GetTransactionListQuery = client.readQuery({
          query: getTransactionListQuery,
        })
        data.getTransactionList = data.getTransactionList.filter(
          t => t.id !== id
        )
        client.writeQuery({ query: getTransactionListQuery, data })

        // update amount of the corresponding account
        const transaction: Transaction = client.readFragment({
          id: `Transaction:${id}`,
          fragment: transactionFragment,
          fragmentName: 'Transaction',
        })

        const account: Account = client.readFragment({
          id: `Account:${transaction.account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
        })

        account.amount = sum(account.amount, -transaction.amount)

        client.writeFragment({
          id: `Account:${account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
          data: account,
        })

        // TODO delete transaction fragment from cache
      },
    }

    if (window.navigator.onLine) {
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

export const DeleteTransaction = compose(
  withRouter,
  withApollo,
  graphql<
    DeleteTransactionProps,
    DeleteTransactionMutation,
    DeleteTransactionMutationVariables
  >(deleteTransactionMutation)
)(C)
