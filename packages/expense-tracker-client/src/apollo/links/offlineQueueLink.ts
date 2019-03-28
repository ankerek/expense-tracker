import QueueLink from 'apollo-link-queue'
import { ApolloLink, Operation } from 'apollo-link'
import { isMutationOperation } from '../../utils/isMutationOperation'

export const offlineQueueLink = new QueueLink()

export const queueOfflineMutationsLink = new ApolloLink((operation, forward) =>
  isMutationOperation(operation)
    ? offlineQueueLink.request(operation, forward)
    : forward(operation)
)
