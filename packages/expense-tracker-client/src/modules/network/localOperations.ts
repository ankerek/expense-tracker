import ApolloClient, { MutationOptions } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { getUpdater } from '@modules/getUpdater'
import { client } from '@apollo/initializeApollo'
import { getCurrentUserData } from '@apollo/state'

const STORAGE_KEY = 'localOperations'
const constructStorageKey = (userId: string) => `localOperations:${userId}`

interface LocalOperation {
  mutationOptions: MutationOptions
  updaterOtherOptions: any
}

export const getLocalOperations = (): LocalOperation[] => {
  const currentUser = getCurrentUserData()
  return (
    JSON.parse(localStorage.getItem(constructStorageKey(currentUser.id))) || []
  )
}

export const setLocalOperation = (operation: LocalOperation) => {
  const currentUser = getCurrentUserData()
  const localOperations = getLocalOperations()
  localStorage.setItem(
    constructStorageKey(currentUser.id),
    JSON.stringify([...localOperations, operation])
  )
}

export const restoreLocalOperations = () => {
  getLocalOperations().forEach(operation => {
    client.mutate({
      ...operation.mutationOptions,
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, operation.updaterOtherOptions),
    })
  })
}

export const removeLocalOperation = (id: string) => {
  const currentUser = getCurrentUserData()
  const localOperations = getLocalOperations()
  localStorage.setItem(
    constructStorageKey(currentUser.id),
    JSON.stringify(
      localOperations.filter(
        operation => operation.mutationOptions.context.operationId !== id
      )
    )
  )
}
