import React from 'react'
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
import { restoreLocalOperations } from '@controllers/network/localOperations'
import {
  cachePersistor,
  client,
  clearClientStore,
} from '@apollo/initializeApollo'

const signInMutation = gql`
  mutation SignInMutation($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        ...User
      }
    }
  }
  ${userFragment}
`

interface SignInProps {
  children: (
    submit: (
      values: SignInMutationVariables
    ) => Promise<NormalizedErrorsMap | null>,
    data: {
      loading: boolean
    }
  ) => JSX.Element | null
}

const initialState = {
  loading: false,
}

class C extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<SignInProps>,
      SignInMutation,
      SignInMutationVariables
    >
> {
  readonly state: Readonly<typeof initialState> = initialState

  handleSignIn = async (values: SignInMutationVariables) => {
    try {
      this.setState({ loading: true })

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

        await clearClientStore()

        this.props.client.writeQuery({
          query: getCurrentUserQuery,
          data: { getCurrentUser: user },
        })

        this.setState({ loading: false })

        restoreLocalOperations(client)

        this.props.history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)

      this.setState({ loading: false })

      return { errors }
    }

    return null
  }

  render() {
    return this.props.children(this.handleSignIn, {
      loading: this.state.loading,
    })
  }
}

export const SignIn = compose(
  withRouter,
  withApollo,
  graphql<SignInProps, SignInMutation, SignInMutationVariables>(signInMutation)
)(C)
