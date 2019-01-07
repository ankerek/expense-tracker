import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : '' },
  }
})

const link = apolloLinkFrom([authLink, httpLink])

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      getAccount: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Account', id: args.id }),
    },
  },
})

// tslint:disable-next-line:no-floating-promises
persistCache({
  cache,
  storage: window.localStorage,
})

export const client = new ApolloClient({
  link,
  cache,
})
