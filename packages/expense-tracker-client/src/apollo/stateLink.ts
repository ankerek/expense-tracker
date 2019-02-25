import { withClientState } from 'apollo-link-state'
import { ApolloCache } from 'apollo-cache'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

const initialState = {
  isOnline: true,
}

export const stateLink = (cache: ApolloCache<NormalizedCacheObject>) =>
  withClientState({
    cache,
    defaults: initialState,
    resolvers: {},
  })
