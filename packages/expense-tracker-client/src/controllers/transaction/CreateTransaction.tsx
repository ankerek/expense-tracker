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
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'

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
    submit: (values: SaveTransactionInput) => void,
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
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateTransactionProps>,
      CreateTransactionMutation,
      CreateTransactionMutationVariables
    >
> {
  readonly state: State = initialState

  render() {
    return this.props.children(this.submit, { loading: this.state.loading })
  }

  private submit = async (values: SaveTransactionInput) => {
    const {
      client,
      mutate,
      history,
      location: { state },
    } = this.props

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Transaction',
      ...values,
      isPersisted: false,
    }

    const mutationOptions: MutationOptions<
      CreateTransactionMutation,
      CreateTransactionMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        createTransaction: optimisticResponse,
      },
      update: (_, { data: { createTransaction } }) => {
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

export const CreateTransaction = compose(
  withRouter,
  withApollo,
  graphql<
    CreateTransactionProps,
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >(createTransactionMutation)
)(C)
