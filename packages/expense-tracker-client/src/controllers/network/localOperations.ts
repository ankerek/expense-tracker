import ApolloClient, { MutationOptions } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { getUpdater } from '@controllers/getUpdater'

const STORAGE_KEY = 'localOperations'

interface LocalOperation {
  mutationOptions: MutationOptions
  updaterOtherOptions: any
}

export const getLocalOperations = (): LocalOperation[] =>
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

export const setLocalOperation = (operation: LocalOperation) => {
  const localOperations = getLocalOperations()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...localOperations, operation])
  )
}

export const restoreLocalOperations = (
  client: ApolloClient<NormalizedCacheObject>
) => {
  getLocalOperations().forEach(operation => {
    client.mutate({
      ...operation.mutationOptions,
      update: (proxy, response) =>
        getUpdater(response)(proxy, response, operation.updaterOtherOptions),
    })
  })
}

export const removeLocalOperation = (id: string) => {
  const localOperations = getLocalOperations()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      localOperations.filter(
        operation => operation.mutationOptions.context.operationId !== id
      )
    )
  )
}
