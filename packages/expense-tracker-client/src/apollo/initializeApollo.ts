import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { typeDefs } from './clientState'
import { getIsOnlineQuery } from '@modules/network/GetIsOnline'
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

// purge local storage cache on store reset
// client.onClearStore(async () => {
//   console.log('purge')
//   await cachePersistor.purge()
//   initClientState()
// })

export const initClientState = () => {
  client.writeQuery({
    query: getIsOnlineQuery,
    data: {
      isOnline: true,
    },
  })
}

export const clearClientStore = async () => {
  await client.clearStore()
  await cachePersistor.purge()
  initClientState()
}

initClientState()
