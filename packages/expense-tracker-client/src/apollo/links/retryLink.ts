import { RetryLink } from 'apollo-link-retry'
import { SaveTransactionMutationName } from '../../controllers/transaction/SaveTransaction'
import { UpdateTransactionMutationName } from '../../controllers/transaction/UpdateTransaction'
import { DeleteTransactionMutationName } from '../../controllers/transaction/DeleteTransaction'

// TODO: move to other file
const offlineOperations = [
  SaveTransactionMutationName,
  UpdateTransactionMutationName,
  DeleteTransactionMutationName,
]

export const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    return (
      error.toString() === 'TypeError: Failed to fetch' &&
      offlineOperations.includes(operation.operationName)
    )
  },
})