import * as React from 'react'
import gql from 'graphql-tag'
import { ChildMutateProps, graphql, Mutation, MutationFn } from 'react-apollo'
import { CreateUserMutation, CreateUserMutationVariables } from '@schema-types'
import { NormalizedErrorsMap, normalizeErrors } from '@utils/normalizeErrors'
import compose from '@shopify/react-compose'
import { RouteComponentProps, withRouter } from 'react-router'

const createUserMutation = gql`
  mutation CreateUserMutation($input: UserCreateInput!) {
    createUser(input: $input) {
      token
    }
  }
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
  ChildMutateProps<
    CreateUserProps,
    CreateUserMutation,
    CreateUserMutationVariables
  > &
    RouteComponentProps
> {
  handleCreateUser = async (values: CreateUserMutationVariables) => {
    try {
      const {
        data: {
          createUser: { token },
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
  }

  render() {
    return this.props.children({ submit: this.handleCreateUser })
  }
}

export const CreateUser = compose(
  withRouter,
  graphql<CreateUserProps, CreateUserMutation, CreateUserMutationVariables>(
    createUserMutation
  )
)(C)
