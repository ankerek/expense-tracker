import React from 'react'
import uuid from 'uuid/v4'
import gql from 'graphql-tag'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables,
  SaveCategoryInput,
} from '@schema-types'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { getIsOnlineQuery } from '@modules/network/GetIsOnline'
import { getUpdater } from '@modules/getUpdater'
import { setLocalOperation } from '@modules/network/localOperations'

export const DeleteCategoryMutationName = 'DeleteCategoryMutation'

const deleteCategoryMutation = gql`
  mutation DeleteCategoryMutation($id: ID!) {
    deleteCategory(id: $id)
  }
`

interface DeleteCategoryProps {
  children: (
    deleteCategory: (prevValues: SaveCategoryInput) => void,
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
      WithApolloClient<DeleteCategoryProps>,
      DeleteCategoryMutation,
      DeleteCategoryMutationVariables
    >
> {
  readonly state: Readonly<typeof initialState> = initialState

  render() {
    return this.props.children(this.deleteCategory, {
      loading: this.state.loading,
    })
  }

  private deleteCategory = async (prevValues: SaveCategoryInput) => {
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
      prevCategory: prevValues,
    }

    const mutationOptions: MutationOptions<
      DeleteCategoryMutation,
      DeleteCategoryMutationVariables
    > = {
      variables: { id },
      optimisticResponse: {
        deleteCategory: true,
      },
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, updaterOtherOptions),
      context: {
        operationId,
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
          mutation: deleteCategoryMutation,
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

export const DeleteCategory = compose(
  withRouter,
  withApollo,
  graphql<
    DeleteCategoryProps,
    DeleteCategoryMutation,
    DeleteCategoryMutationVariables
  >(deleteCategoryMutation)
)(C)
