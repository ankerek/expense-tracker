import gql from 'graphql-tag'
import { currencyFragment } from '@controllers/currency/fragments'

export const accountFragment = gql`
  fragment Account on Account {
    id
    name
    amount
    currency {
      ...Currency
    }
  }
  ${currencyFragment}
`
