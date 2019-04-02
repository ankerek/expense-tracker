import { ApolloLink, Operation, NextLink, Observable } from 'apollo-link'
import { removeLocalOperation } from '@modules/network/localOperations'
import { isMutationOperation } from '@utils/isMutationOperation'

/*
 * Link that removes pending operations from localStorage on mutation complete
 */
export class LocalOperationsLink extends ApolloLink {
  public request(operation: Operation, forward: NextLink) {
    if (isMutationOperation(operation)) {
      return new Observable(observer => {
        const subscription = forward(operation).subscribe({
          next: response => {
            // do not remove local operation if user was UNAUTHENTICATED
            if (
              !(
                response.errors &&
                response.errors.find(
                  error => error.extensions.code === 'UNAUTHENTICATED'
                )
              )
            ) {
              const operationId = (operation.getContext() || {}).operationId
              if (operationId) {
                removeLocalOperation(operationId)
              }
            }
            observer.next(response)
          },
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
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
