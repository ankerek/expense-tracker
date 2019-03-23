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
  SaveTransactionMutation,
  SaveTransactionMutationVariables,
  SaveTransactionInput,
  Transaction,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { transactionFragment } from './fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { getUpdater } from '@controllers/getUpdater'
import { setLocalOperation } from '@controllers/network/localOperations'

export const SaveTransactionMutationName = 'SaveTransactionMutation'

const saveTransactionMutation = gql`
  mutation SaveTransactionMutation($input: SaveTransactionInput!) {
    saveTransaction(input: $input) {
      ...Transaction
    }
  }
  ${transactionFragment}
`

interface SaveTransactionProps {
  children: (
    submit: (values: SaveTransactionInput) => void,
    data: {
      loading: boolean
    }
  ) => React.ReactNode
}

const initialState = {
  loading: false,
}

type State = Readonly<typeof initialState>

class C extends React.Component<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<SaveTransactionProps>,
      SaveTransactionMutation,
      SaveTransactionMutationVariables
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
    const operationId = uuid()

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Transaction',
      ...values,
      isPersisted: false,
    }

    // first stash away a current transaction before the update
    const prevTransaction: Transaction = client.readFragment({
      id: `Transaction:${values.id}`,
      fragment: transactionFragment,
      fragmentName: 'Transaction',
    })

    const updaterOtherOptions: any = {
      prevTransaction,
    }

    const mutationOptions: MutationOptions<
      SaveTransactionMutation,
      SaveTransactionMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: { saveTransaction: optimisticResponse },
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, updaterOtherOptions),
      context: { operationId, account: values.account },
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
          mutation: saveTransactionMutation,
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

export const SaveTransaction = compose<SaveTransactionProps>(
  withRouter,
  withApollo,
  graphql<
    SaveTransactionProps,
    SaveTransactionMutation,
    SaveTransactionMutationVariables
  >(saveTransactionMutation)
)(C)
