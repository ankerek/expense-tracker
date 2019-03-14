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
  CreateAccountMutation,
  CreateAccountMutationVariables,
  GetAccountListQuery,
  SaveAccountInput,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { RouteComponentProps, withRouter } from 'react-router'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'
import { getAccountListQuery } from '@controllers/account/AccountList'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'

export const CreateAccountMutationName = 'CreateAccountMutation'

const createAccountMutation = gql`
  mutation CreateAccountMutation($input: SaveAccountInput!) {
    createAccount(input: $input) {
      ...Account
    }
  }
  ${accountFragment}
`

export interface CreateAccountProps {
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
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateAccountProps>,
      CreateAccountMutation,
      CreateAccountMutationVariables
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
    } = this.props

    this.setState({ loading: true })

    const optimisticResponse: any = {
      __typename: 'Account',
      ...values,
    }

    const mutationOptions: MutationOptions<
      CreateAccountMutation,
      CreateAccountMutationVariables
    > = {
      variables: cleanPropertiesBeforeMutation({ input: values }),
      optimisticResponse: {
        createAccount: optimisticResponse,
      },
      update: (_, { data: { createAccount } }) => {
        // push new transaction to Account list
        const data: GetAccountListQuery = client.readQuery({
          query: getAccountListQuery,
        })

        data.getAccountList.push(createAccount)

        client.writeQuery({ query: getAccountListQuery, data })
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

export const CreateAccount = compose(
  withRouter,
  withApollo,
  graphql<null, CreateAccountMutation, CreateAccountMutationVariables>(
    createAccountMutation
  )
)(C)
