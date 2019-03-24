import gql from 'graphql-tag'

export const categoryFragment = gql`
  fragment Category on Category {
    id
    name
    amount
    isPersisted
  }
`
