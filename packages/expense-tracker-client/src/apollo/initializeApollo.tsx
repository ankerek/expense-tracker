import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom } from 'apollo-link'
import localForage from 'localforage'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { typeDefs } from './clientSchema'
import { authLink } from './authLink'
import { retryLink } from './retryLink'
import { offlineLink } from './offlineLink'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { localOperationsLink } from './localOperationsLink'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
})

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
  httpLink,
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
