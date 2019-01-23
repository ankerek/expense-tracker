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
  GetTransactionListQuery,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { transactionFragment } from './fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'

export const UpdateTransactionMutationName = 'UpdateTransactionMutation'

const updateTransactionMutation = gql`
  mutation UpdateTransactionMutation($id: ID!, $input: SaveTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...transaction
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
      mutate,
      history,
      match: {
        params: { id },
      },
      location: { state },
    } = this.props

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
      // update: (client, { data: { updateTransaction } }) => {
      //   const data: GetTransactionListQuery = client.readQuery({
      //     query: getTransactionListQuery,
      //   })
      //   data.getTransactionList.push(updateTransaction)
      //   client.writeQuery({ query: getTransactionListQuery, data })
      // },
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
