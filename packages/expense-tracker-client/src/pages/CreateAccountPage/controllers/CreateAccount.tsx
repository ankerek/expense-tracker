import * as React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from '@schema-types'
import { normalizeErrors, NormalizedErrorsMap } from '@utils/normalizeErrors'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { accountFragment } from '@controllers/account/fragments'

const createAccountMutation = gql`
  mutation CreateAccountMutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ...account
    }
  }
  ${accountFragment}
`

interface CreateAccountProps {
  children: (
    data: {
      submit: (
        values: CreateAccountMutationVariables
      ) => Promise<NormalizedErrorsMap | null>
    }
  ) => JSX.Element | null
}

class C extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateAccountProps>,
      CreateAccountMutation,
      CreateAccountMutationVariables
    >
> {
  createAccount = async (values: CreateAccountMutationVariables) => {
    try {
      const {
        mutate,
        history,
        location: { state },
      } = this.props

      const {
        data: { createAccount },
      } = await mutate({
        variables: values,
      })

      // this.props.client.writeQuery({
      //   query: getCurrentUserQuery,
      //   data: { getCurrentUser: user },
      // })
      if (state && state.next) {
        history.push(state.next)
      } else {
        history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)
      return { errors }
    }

    return null
  }

  render() {
    return this.props.children({ submit: this.createAccount })
  }
}

export const CreateAccount = compose(
  withRouter,
  withApollo,
  graphql<
    CreateAccountProps,
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(createAccountMutation)
)(C)
