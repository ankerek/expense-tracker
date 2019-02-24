import QueueLink from 'apollo-link-queue'
import { ApolloLink, Operation } from 'apollo-link'

const isMutationOperation = (operation: Operation) => {
  return (
    operation.query.definitions.filter((e: any) => e.operation === 'mutation')
      .length > 0
  )
}

export const offlineQueueLink = new QueueLink()

export const queueOfflineMutationsLink = new ApolloLink((operation, forward) =>
  isMutationOperation(operation)
    ? offlineQueueLink.request(operation, forward)
    : forward(operation)
)
