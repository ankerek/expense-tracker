import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation, MutationFn, MutationResult } from 'react-apollo'
import { CreateUserMutation as CreateUserMutationProps, CreateUserMutationVariables } from '@schema-types'

const createUserMutation = gql`
  mutation CreateUserMutation($input: UserCreateInput!) {
    createUser(input: $input) {
      id
    }
  }
`

// interface WithCreateUser {
//   createUser: MutationFn<CreateUserMutationProps, CreateUserMutationVariables>
// }

export type CreateUserMutationFn = MutationFn<CreateUserMutationProps, CreateUserMutationVariables>
export type CreateUserMutationResult = MutationResult<CreateUserMutationProps>

interface CreateUserProps {
  children: (
    mutation: CreateUserMutationFn,
    result: CreateUserMutationResult
  ) => JSX.Element | null
}

export class CreateUserMutation extends React.PureComponent<CreateUserProps> {
  render() {
    const { children } = this.props
    return (
      <Mutation<CreateUserMutationProps, CreateUserMutationVariables>
        mutation={createUserMutation}
      >
        {(...args) => children(...args)}
      </Mutation>
    )
  }
}
