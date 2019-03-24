import React from 'react'
import uuid from 'uuid/v4'
import { compose } from '@utils/compose'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  SaveCategoryMutation,
  SaveCategoryMutationVariables,
  SaveCategoryInput,
  Category,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { RouteComponentProps, withRouter } from 'react-router'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { getUpdater } from '@controllers/getUpdater'
import { setLocalOperation } from '@controllers/network/localOperations'
import { categoryFragment } from './fragments'

export const SaveCategoryMutationName = 'SaveCategoryMutation'

const saveCategoryMutation = gql`
  mutation SaveCategoryMutation($input: SaveCategoryInput!) {
    saveCategory(input: $input) {
      ...Category
    }
  }
  ${categoryFragment}
`

export interface SaveCategoryProps {
  children: (
    submit: (values: SaveCategoryInput) => Promise<NormalizedErrorsMap | null>,
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
      WithApolloClient<SaveCategoryProps>,
      SaveCategoryMutation,
      SaveCategoryMutationVariables
    >
> {
  readonly state: State = initialState

  render() {
    return this.props.children(this.submit, {
      loading: this.state.loading,
    })
  }

  private submit = async (values: SaveCategoryInput) => {
    const {
      client,
      mutate,
      history,
      location: { state },
    } = this.props
    const operationId = uuid()

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Category',
      ...values,
      isPersisted: false,
    }

    // first stash away a current account before the update
    const prevCategory: Category = client.readFragment({
      id: `Category:${values.id}`,
      fragment: accountFragment,
      fragmentName: 'Category',
    })

    const updaterOtherOptions: any = {
      prevCategory,
    }

    const mutationOptions: MutationOptions<
      SaveCategoryMutation,
      SaveCategoryMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        saveCategory: optimisticResponse,
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
      try {
        await mutate(mutationOptions)

        this.setState({ loading: false })
      } catch (res) {
        const errors = normalizeErrors(res.graphQLErrors)

        this.setState({ loading: false })

        return { errors }
      }
    } else {
      mutate(mutationOptions)

      setLocalOperation({
        mutationOptions: {
          ...mutationOptions,
          mutation: saveCategoryMutation,
        },
        updaterOtherOptions,
      })
    }

    if (state && state.next) {
      history.push(state.next)
    } else {
      history.push('/')
    }

    return null
  }
}

export const SaveCategory = compose<SaveCategoryProps>(
  withRouter,
  withApollo,
  graphql<null, SaveCategoryMutation, SaveCategoryMutationVariables>(
    saveCategoryMutation
  )
)(C)
