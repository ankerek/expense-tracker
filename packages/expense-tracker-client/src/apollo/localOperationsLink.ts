import { ApolloLink, Operation, NextLink, Observable } from 'apollo-link'
import { removeLocalOperation } from '@controllers/network/localOperations'
import { isMutationOperation } from '@utils/isMutationOperation'

/*
 * Link that removes pending operations from localStorage on mutation complete
 */
export class LocalOperationsLink extends ApolloLink {
  public request(operation: Operation, forward: NextLink) {
    if (isMutationOperation(operation)) {
      return new Observable(observer => {
        const subscription = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: () => {
            const operationId = (operation.getContext() || {}).operationId
            if (operationId) {
              removeLocalOperation(operationId)
            }
            observer.complete()
          },
        })

        return () => {
          if (subscription) {
            subscription.unsubscribe()
          }
        }
      })
    }

    return forward(operation)
  }
}

export const localOperationsLink = new LocalOperationsLink()
