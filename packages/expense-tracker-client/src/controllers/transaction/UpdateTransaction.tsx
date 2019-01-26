import React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
  SaveTransactionInput,
  Account,
  Transaction,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { transactionFragment } from './fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { accountFragment } from '@controllers/account/fragments'
import { sum } from '@utils/math'

export const UpdateTransactionMutationName = 'UpdateTransactionMutation'

const updateTransactionMutation = gql`
  mutation UpdateTransactionMutation($id: ID!, $input: SaveTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...Transaction
    }
  }
  ${transactionFragment}
`

interface UpdateTransactionProps {
  children: (
    data: {
      submit: (values: SaveTransactionInput) => void
    }
  ) => JSX.Element | null
}

class C extends React.Component<
  RouteComponentProps<{ id: string }> &
    ChildMutateProps<
      WithApolloClient<UpdateTransactionProps>,
      UpdateTransactionMutation,
      UpdateTransactionMutationVariables
    >
> {
  render() {
    return this.props.children({ submit: this.submit })
  }

  private submit = (values: SaveTransactionInput) => {
    const {
      client,
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props

    // first stash away a current transaction before the update
    const prevTransaction: Transaction = client.readFragment({
      id: `Transaction:${id}`,
      fragment: transactionFragment,
      fragmentName: 'Transaction',
    })

    const optimisticResponse: any = {
      __typename: 'Transaction',
      ...values,
    }

    mutate({
      variables: {
        id,
        ...cleanPropertiesBeforeMutation({ input: values }),
      },
      optimisticResponse: {
        updateTransaction: optimisticResponse,
      },
      update: (_, { data: { updateTransaction } }) => {
        // account where the updated transaction belongs to
        const account: Account = client.readFragment({
          id: `Account:${updateTransaction.account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
        })

        // this num will be added to the account
        let newAccountAmountDifference = 0

        if (prevTransaction.account.id !== updateTransaction.account.id) {
          // transaction has moved to different account
          // it's needed to deduct the amount from the prev account
          const prevAccount: Account = client.readFragment({
            id: `Account:${prevTransaction.account.id}`,
            fragment: accountFragment,
            fragmentName: 'Account',
          })

          console.log(
            prevAccount.amount,
            sum(prevAccount.amount, -prevTransaction.amount)
          )
          prevAccount.amount = sum(prevAccount.amount, -prevTransaction.amount)

          client.writeFragment({
            id: `Account:${prevAccount.id}`,
            fragment: accountFragment,
            fragmentName: 'Account',
            data: prevAccount,
          })

          newAccountAmountDifference = updateTransaction.amount
        } else if (prevTransaction.amount !== updateTransaction.amount) {
          newAccountAmountDifference = sum(
            updateTransaction.amount,
            -prevTransaction.amount
          )
        }

        account.amount = sum(account.amount, newAccountAmountDifference)

        client.writeFragment({
          id: `Account:${updateTransaction.account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
          data: account,
        })
      },
    })

    if (state && state.next) {
      history.push(state.next)
    } else {
      history.push('/')
    }
  }
}

export const UpdateTransaction = compose(
  withRouter,
  withApollo,
  graphql<
    UpdateTransactionProps,
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables
  >(updateTransactionMutation)
)(C)
