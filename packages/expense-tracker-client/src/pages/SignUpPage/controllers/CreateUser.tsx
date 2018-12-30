import * as React from 'react'
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

const createUserMutation = gql`
  mutation CreateUserMutation($input: UserCreateInput!) {
    createUser(input: $input) {
      token
      user {
        ...user
      }
    }
  }
  ${userFragment}
`

export type CreateUserMutationFn = MutationFn<
  CreateUserMutation,
  CreateUserMutationVariables
>

interface CreateUserProps {
  children: (
    data: {
      submit: (
        values: CreateUserMutationVariables
      ) => Promise<NormalizedErrorsMap | null>
    }
  ) => JSX.Element | null
}

class C extends React.PureComponent<
  RouteComponentProps &
    ChildMutateProps<
      WithApolloClient<CreateUserProps>,
      CreateUserMutation,
      CreateUserMutationVariables
    >
> {
  handleCreateUser = async (values: CreateUserMutationVariables) => {
    try {
      const res = await this.props.mutate({
        variables: values,
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

        this.props.history.push('/')
      }
    } catch (res) {
      const errors = normalizeErrors(res.graphQLErrors)
      return { errors }
    }
  }

  render() {
    return this.props.children({ submit: this.handleCreateUser })
  }
}

export const CreateUser = compose(
  withRouter,
  withApollo,
  graphql<CreateUserProps, CreateUserMutation, CreateUserMutationVariables>(
    createUserMutation
  )
)(C)
