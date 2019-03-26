import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { typeDefs } from './clientSchema'
import { authLink } from './authLink'
import { retryLink } from './retryLink'
import { offlineLink } from './offlineLink'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { localOperationsLink } from './localOperationsLink'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/`,
  options: {
    reconnect: true,
  },
})

const terminatedLink = split(
  ({ query }) => {
    const { kind, operation }: any = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      getAccount: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Account', id: args.id }),
      getCategory: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Category', id: args.id }),
      getTransaction: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Transaction', id: args.id }),
    },
  },
})

const link = apolloLinkFrom([
  authLink,
  retryLink,
  offlineLink,
  localOperationsLink,
  terminatedLink,
])

export const client = new ApolloClient({
  link,
  cache,
  typeDefs,
})

// local storage cache persistor
export const cachePersistor = new CachePersistor({
  cache,
  storage: window.localStorage,
})

// promise restoring cache from local storage
export const waitForCache = cachePersistor.restore()

// purge local storage cache on store reset
client.onResetStore(() => cachePersistor.purge())

// set initial local state
cache.writeQuery({
  query: getIsOnlineQuery,
  data: {
    isOnline: true,
  },
})
