import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'

export const transactionFragment = gql`
  fragment transaction on Transaction {
    id
    createdAt
    description
    amount
    account {
      ...account
    }
  }
  ${accountFragment}
`
