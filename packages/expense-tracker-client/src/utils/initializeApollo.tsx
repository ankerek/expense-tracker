import ApolloClient from 'apollo-client'
import * as ApolloLink from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
}                 )

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : '' },
  }
})

const link = ApolloLink.from([authLink, httpLink])

const cache = new InMemoryCache()

export const client = new ApolloClient({
  link,
  cache,
})
