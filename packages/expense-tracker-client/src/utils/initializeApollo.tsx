import ApolloClient from 'apollo-client'
import { from as apolloLinkFrom } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { RetryLink } from 'apollo-link-retry'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { CreateTransactionMutationName } from '@controllers/transaction/CreateTransaction'
import { UpdateTransactionMutationName } from '@controllers/transaction/UpdateTransaction'
import { DeleteTransactionMutationName } from '@controllers/transaction/DeleteTransaction'

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

// TODO: move to other file
const offlineOperations = [
  CreateTransactionMutationName,
  UpdateTransactionMutationName,
  DeleteTransactionMutationName,
]

const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    return (
      error.toString() === 'TypeError: Failed to fetch' &&
      offlineOperations.includes(operation.operationName)
    )
  },
})

const link = apolloLinkFrom([authLink, retryLink, httpLink])

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

export const waitForCache = persistCache({
  cache,
  storage: window.localStorage,
})

export const client = new ApolloClient({
  link,
  cache,
})
