import React from 'react'
import gql from 'graphql-tag'
import {
  withApollo,
  ChildMutateProps,
  graphql,
  MutationFn,
  WithApolloClient,
} from 'react-apollo'
import { CreateUserMutation, CreateUserMutationVariables } from '@schema-types'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from '@utils/compose'
import { getCurrentUserQuery } from '@controllers/user/GetCurrentUser'
import { userFragment } from '@controllers/user/fragments'
import { cleanPropertiesBeforeMutation } from '@utils/cleanPropertiesBeforeMutation'

const createUserMutation = gql`
  mutation CreateUserMutation($input: UserCreateInput!) {
    createUser(input: $input) {
      token
      user {
        ...User
      }
    }
  }
  ${userFragment}
`

interface CreateUserProps {
  children: (
    submit: (
      values: CreateUserMutationVariables
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
      WithApolloClient<CreateUserProps>,
      CreateUserMutation,
      CreateUserMutationVariables
    >
> {
  readonly state: Readonly<typeof initialState> = initialState

  handleCreateUser = async (values: CreateUserMutationVariables) => {
    try {
      this.setState({ loading: true })

      const res = await this.props.mutate({
        variables: cleanPropertiesBeforeMutation(values),
      })

      if (res) {
        const {
          data: {
            createUser: { token, user },
          },
        } = res

        localStorage.setItem('jwtToken', token)

        this.props.client.writeQuery({
          query: getCurrentUserQuery,
          data: { getCurrentUser: user },
        })

        this.setState({ loading: false })

        this.props.history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)

      this.setState({ loading: false })

      return { errors }
    }
  }

  render() {
    return this.props.children(this.handleCreateUser, {
      loading: this.state.loading,
    })
  }
}

export const CreateUser = compose(
  withRouter,
  withApollo,
  graphql<CreateUserProps, CreateUserMutation, CreateUserMutationVariables>(
    createUserMutation
  )
)(C)
