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
  SaveTransactionInput,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { getIsOnlineQuery } from '@modules/network/GetIsOnline'
import { getUpdater } from '@modules/getUpdater'
import { setLocalOperation } from '@modules/network/localOperations'

export const DeleteTransactionMutationName = 'DeleteTransactionMutation'

const deleteTransactionMutation = gql`
  mutation DeleteTransactionMutation($id: ID!) {
    deleteTransaction(id: $id)
  }
`

interface DeleteTransactionProps {
  children: (
    deleteTransaction: (values: SaveTransactionInput) => void,
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

  private deleteTransaction = async (prevValues: SaveTransactionInput) => {
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

    const updaterOtherOptions: any = {
      prevTransaction: prevValues,
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
        account: prevValues.account,
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
