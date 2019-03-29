import { RetryLink } from 'apollo-link-retry'
import { isMutationOperation } from '@utils/isMutationOperation'

export const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    console.log('error', error)
    return (
      error.toString() === 'TypeError: Failed to fetch' &&
      isMutationOperation(operation)
    )
  },
})
