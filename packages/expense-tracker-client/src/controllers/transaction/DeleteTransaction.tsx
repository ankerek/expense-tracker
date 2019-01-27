import React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  Account,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  SaveTransactionInput,
  GetTransactionListQuery,
  DeleteTransactionMutation,
  DeleteTransactionMutationVariables,
  Transaction,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { sum } from '@utils/math'
import { transactionFragment } from './fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
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
    data: {
      deleteTransaction: () => void
    }
  ) => JSX.Element | null
}

class C extends React.Component<
  RouteComponentProps<{ id: string }> &
    ChildMutateProps<
      WithApolloClient<DeleteTransactionProps>,
      DeleteTransactionMutation,
      DeleteTransactionMutationVariables
    >
> {
  render() {
    return this.props.children({ deleteTransaction: this.deleteTransaction })
  }

  private deleteTransaction = () => {
    const {
      // client,
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props

    mutate({
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

        // // update amount of the corresponding account
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
    })

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
