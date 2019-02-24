import { RetryLink } from 'apollo-link-retry'
import { CreateTransactionMutationName } from '@controllers/transaction/CreateTransaction'
import { UpdateTransactionMutationName } from '@controllers/transaction/UpdateTransaction'
import { DeleteTransactionMutationName } from '@controllers/transaction/DeleteTransaction'

// TODO: move to other file
const offlineOperations = [
  CreateTransactionMutationName,
  UpdateTransactionMutationName,
  DeleteTransactionMutationName,
]

export const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    console.log('retry')
    return (
      error.toString() === 'TypeError: Failed to fetch' &&
      offlineOperations.includes(operation.operationName)
    )
  },
})
