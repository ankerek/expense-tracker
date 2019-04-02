// @deprecated
import React from 'react'
import { compose } from '@utils/compose'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  SaveAccountInput,
  UpdateAccountMutation,
  UpdateAccountMutationVariables,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@modules/account/fragments'
import { RouteComponentProps, withRouter } from 'react-router'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getIsOnlineQuery } from '@modules/network/GetIsOnline'

export const UpdateAccountMutationName = 'UpdateAccountMutation'

const updateAccountMutation = gql`
  mutation UpdateAccountMutation($id: ID!, $input: SaveAccountInput!) {
    updateAccount(id: $id, input: $input) {
      ...Account
    }
  }
  ${accountFragment}
`

export interface UpdateAccountProps {
  children: (
    submit: (values: SaveAccountInput) => Promise<NormalizedErrorsMap | null>,
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
      WithApolloClient<UpdateAccountProps>,
      UpdateAccountMutation,
      UpdateAccountMutationVariables
    >
> {
  readonly state: State = initialState

  render() {
    return this.props.children(this.submit, {
      loading: this.state.loading,
    })
  }

  private submit = async (values: SaveAccountInput) => {
    const {
      client,
      mutate,
      history,
      location: { state },
      match: {
        params: { id },
      },
    } = this.props

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Account',
      ...values,
      isPersisted: false,
    }

    const mutationOptions: MutationOptions<
      UpdateAccountMutation,
      UpdateAccountMutationVariables
    > = {
      variables: {
        id,
        ...cleanPropertiesBeforeMutation({ input: values }),
      },
      optimisticResponse: {
        updateAccount: optimisticResponse,
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
    }

    if (state && state.next) {
      history.push(state.next)
    } else {
      history.push('/')
    }

    return null
  }
}

export const UpdateAccount = compose(
  withRouter,
  withApollo,
  graphql<null, UpdateAccountMutation, UpdateAccountMutationVariables>(
    updateAccountMutation
  )
)(C)
