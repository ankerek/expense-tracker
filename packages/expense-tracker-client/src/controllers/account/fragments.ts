import gql from 'graphql-tag'
import { currencyFragment } from '@controllers/currency/fragments'

export const accountFragment = gql`
  fragment account on Account {
    id
    name
    currency {
      ...currency
    }
  }
  ${currencyFragment}
`
