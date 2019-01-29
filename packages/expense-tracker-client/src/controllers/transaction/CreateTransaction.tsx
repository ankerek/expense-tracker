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
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { sum } from '@utils/math'
import { transactionFragment } from './fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { accountFragment } from '@controllers/account/fragments'

export const CreateTransactionMutationName = 'CreateTransactionMutation'

const createTransactionMutation = gql`
  mutation CreateTransactionMutation($input: SaveTransactionInput!) {
    createTransaction(input: $input) {
      ...Transaction
    }
  }
  ${transactionFragment}
`

interface CreateTransactionProps {
  children: (
    data: {
      submit: (values: SaveTransactionInput) => void
    }
  ) => JSX.Element | null
}

class C extends React.Component<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateTransactionProps>,
      CreateTransactionMutation,
      CreateTransactionMutationVariables
    >
> {
  render() {
    return this.props.children({ submit: this.submit })
  }

  private submit = (values: SaveTransactionInput) => {
    const {
      mutate,
      history,
      location: { state },
    } = this.props

    const optimisticResponse: any = {
      __typename: 'Transaction',
      ...values,
    }

    mutate({
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        createTransaction: optimisticResponse,
      },
      update: (client, { data: { createTransaction } }) => {
        // push new transaction to Transaction list
        const data: GetTransactionListQuery = client.readQuery({
          query: getTransactionListQuery,
        })
        data.getTransactionList.push(createTransaction)
        client.writeQuery({ query: getTransactionListQuery, data })

        // update amount of the corresponding account
        const account: Account = client.readFragment({
          id: `Account:${createTransaction.account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
        })

        account.amount = sum(account.amount, createTransaction.amount)

        client.writeFragment({
          id: `Account:${createTransaction.account.id}`,
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

export const CreateTransaction = compose(
  withRouter,
  withApollo,
  graphql<
    CreateTransactionProps,
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >(createTransactionMutation)
)(C)