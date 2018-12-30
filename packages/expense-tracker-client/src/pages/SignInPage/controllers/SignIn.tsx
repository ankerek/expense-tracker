import * as React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  MutationFn,
  ChildMutateProps,
  withApollo,
  WithApolloClient,
} from 'react-apollo'
import { SignInMutation, SignInMutationVariables } from '@schema-types'
import { normalizeErrors, NormalizedErrorsMap } from '@utils/normalizeErrors'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from '@utils/compose'
import { getCurrentUserQuery } from '@controllers/user/GetCurrentUser'
import { userFragment } from '@controllers/user/fragments'

const signInMutation = gql`
  mutation SignInMutation($input: UserCreateInput!) {
    signIn(input: $input) {
      token
      user {
        ...user
      }
    }
  }
  ${userFragment}
`

export type SignInMutationFn = MutationFn<
  SignInMutation,
  SignInMutationVariables
>

interface SignInProps {
  children: (
    data: {
      submit: (
        values: SignInMutationVariables
      ) => Promise<NormalizedErrorsMap | null>
    }
  ) => JSX.Element | null
}

class C extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<SignInProps>,
      SignInMutation,
      SignInMutationVariables
    >
> {
  handleSignIn = async (values: SignInMutationVariables) => {
    try {
      const res = await this.props.mutate({
        variables: values,
      })

      if (res) {
        const {
          data: {
            signIn: { token, user },
          },
        } = res

        localStorage.setItem('jwtToken', token)

        this.props.client.writeQuery({
          query: getCurrentUserQuery,
          data: { getCurrentUser: user },
        })

        this.props.history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)
      return { errors }
    }

    return null
  }

  render() {
    return this.props.children({ submit: this.handleSignIn })
  }
}

export const SignIn = compose(
  withRouter,
  withApollo,
  graphql<SignInProps, SignInMutation, SignInMutationVariables>(signInMutation)
)(C)
