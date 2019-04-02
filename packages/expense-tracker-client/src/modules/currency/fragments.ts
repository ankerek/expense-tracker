import gql from 'graphql-tag'

export const currencyFragment = gql`
  fragment Currency on Currency {
    id
    symbol
  }
`
