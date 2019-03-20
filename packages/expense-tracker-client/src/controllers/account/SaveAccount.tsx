import React from 'react'
import { compose } from '@utils/compose'
import {
  ChildMutateProps,
  graphql,
  MutationOptions,
  MutationUpdaterFn,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  SaveAccountMutation,
  SaveAccountMutationVariables,
  GetAccountListQuery,
  SaveAccountInput,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { RouteComponentProps, withRouter } from 'react-router'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getAccountListQuery } from '@controllers/account/GetAccountList'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'

export const SaveAccountMutationName = 'SaveAccountMutation'

const saveAccountMutation = gql`
  mutation SaveAccountMutation($input: SaveAccountInput!) {
    saveAccount(input: $input) {
      ...Account
    }
  }
  ${accountFragment}
`

export interface SaveAccountProps {
  children: (
    submit: (values: SaveAccountInput) => Promise<NormalizedErrorsMap | null>,
    data: {
      loading: boolean
    }
  ) => JSX.Element | null
  update?: MutationUpdaterFn<SaveAccountMutation>
}

const initialState = {
  loading: false,
}

type State = Readonly<typeof initialState>

class C extends React.Component<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<SaveAccountProps>,
      SaveAccountMutation,
      SaveAccountMutationVariables
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
      update,
    } = this.props

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Account',
      ...values,
      isPersisted: false,
    }

    const mutationOptions: MutationOptions<
      SaveAccountMutation,
      SaveAccountMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        saveAccount: optimisticResponse,
      },
      update,
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

export const SaveAccount = compose<SaveAccountProps>(
  withRouter,
  withApollo,
  graphql<null, SaveAccountMutation, SaveAccountMutationVariables>(
    saveAccountMutation
  )
)(C)
