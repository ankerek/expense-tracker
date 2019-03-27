import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { typeDefs } from './clientSchema'
import { authLink } from './authLink'
import { retryLink } from './retryLink'
import { offlineLink } from './offlineLink'
import { getIsOnlineQuery } from '@controllers/network/GetIsOnline'
import { localOperationsLink } from './localOperationsLink'
import { terminatingLink } from './terminatingLink'

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
  terminatingLink,
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
