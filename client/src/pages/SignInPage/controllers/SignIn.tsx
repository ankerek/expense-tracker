import * as React from 'react'
import gql from 'graphql-tag'
import {
  graphql,
  MutationFn,
  ChildMutateProps,
} from 'react-apollo'
import { SignInMutation, SignInMutationVariables } from '@schema-types'
import { normalizeErrors, NormalizedErrorsMap } from '@utils/normalizeErrors'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import compose from '@shopify/react-compose'

const signInMutation = gql`
  mutation SignInMutation($input: UserCreateInput!) {
    signIn(input: $input) {
      token
    }
  }
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
  ChildMutateProps<SignInProps, SignInMutation, SignInMutationVariables> &
    RouteComponentProps
> {
  handleSignIn = async (values: SignInMutationVariables) => {
    try {
      const {
        data: {
          signIn: { token },
        },
      } = await this.props.mutate({
        variables: values,
      })

      localStorage.setItem('jwtToken', token)

      this.props.history.push('/')
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
  graphql<SignInProps, SignInMutation, SignInMutationVariables>(signInMutation)
)(C)
