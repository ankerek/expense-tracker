import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom } from 'apollo-link'
import localForage from 'localforage'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { authLink } from './authLink'
import { retryLink } from './retryLink'
import { offlineLink } from './offlineLink'
import { stateLink } from '@apollo/stateLink'

const API_BASE_URL = '/graphql'

const httpLink = new HttpLink({
  uri: API_BASE_URL,
})

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      getAccount: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Account', id: args.id }),
      getTransaction: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'Transaction', id: args.id }),
    },
  },
})

const link = apolloLinkFrom([
  authLink,
  stateLink(cache),
  retryLink,
  offlineLink,
  httpLink,
])

export const client = new ApolloClient({
  link,
  cache,
})

// local storage cache persistor
export const cachePersistor = new CachePersistor({
  cache,
  storage: localForage as any,
})

// promise restoring cache from local storage
export const waitForCache = cachePersistor.restore()

// purge local storage cache on store reset
client.onResetStore(() => cachePersistor.purge())
