import gql from 'graphql-tag'

export const accountFragment = gql`
  fragment Account on Account {
    id
    name
    amount
  }
`
