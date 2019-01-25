import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'

export const transactionFragment = gql`
  fragment Transaction on Transaction {
    id
    createdAt
    description
    amount
    account {
      ...Account
    }
  }
  ${accountFragment}
`
