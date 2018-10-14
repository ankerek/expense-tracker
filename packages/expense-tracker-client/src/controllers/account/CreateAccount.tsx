import { compose } from '@utils/compose'
import { graphql } from 'react-apollo'
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from '@schema-types'
import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { SaveAccount } from './SaveAccount'

const createAccountMutation = gql`
  mutation CreateAccountMutation($input: SaveAccountInput!) {
    createAccount(input: $input) {
      ...account
    }
  }
  ${accountFragment}
`

export const CreateAccount = compose(
  graphql<null, CreateAccountMutation, CreateAccountMutationVariables>(
    createAccountMutation
  )
)(SaveAccount)
