import * as React from 'react'
import { render } from 'react-dom'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { UserListQueryProps } from '@schema-types'
import { ApolloProvider, Query } from 'react-apollo'
import { MainLayout } from '@core-components/MainLayout'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
  // headers: {
  //   authorization: `Bearer ${
  //     process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
  //     }`,
  // },
})

const cache = new InMemoryCache()

const client = new ApolloClient({
  link: httpLink,
  cache,
})

export const userListQuery = gql`
  query UserListQueryProps {
    users {
      id
      email
    }
  }
`

class UserListQuery extends Query<UserListQueryProps> {}

class Hello extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <UserListQuery query={userListQuery}>
          {({ data }) => (
            <div>My Profile {console.log(data)}</div>
          )}
        </UserListQuery>
      </div>
    )
  }
}

const App = () => (
  <ApolloProvider client={client}>
    <MainLayout />
  </ApolloProvider>
)

render(<App />, document.getElementById('root'))
