import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { initialState, typeDefs } from './clientState'
import { links } from './links'

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

export const client = new ApolloClient({
  link: links,
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

export const initClientState = () => {
  client.writeData({
    data: initialState,
  })
}

export const clearClientStore = async () => {
  await client.clearStore()
  await cachePersistor.purge()
  initClientState()
}

initClientState()
