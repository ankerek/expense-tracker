import gql from 'graphql-tag'
import { accountFragment } from '@controllers/account/fragments'
import { categoryFragment } from '@controllers/category/fragments'

export const transactionFragment = gql`
  fragment Transaction on Transaction {
    id
    createdAt
    description
    amount
    account {
      ...Account
    }
    category {
      ...Category
    }
    isPersisted
  }
  ${accountFragment}
  ${categoryFragment}
`
