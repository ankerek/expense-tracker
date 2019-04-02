import gql from 'graphql-tag'
import { currencyFragment } from '@modules/currency/fragments'

export const userFragment = gql`
  fragment User on User {
    id
    email
    currency {
      ...Currency
    }
  }
  ${currencyFragment}
`
