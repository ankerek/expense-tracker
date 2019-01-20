import gql from 'graphql-tag'

export const currencyFragment = gql`
  fragment currency on Currency {
    id
    symbol
  }
`
