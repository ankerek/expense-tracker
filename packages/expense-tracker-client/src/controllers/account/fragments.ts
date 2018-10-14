import gql from 'graphql-tag'

export const accountFragment = gql`
  fragment account on Account {
    id
    name
    currency
  }
`
