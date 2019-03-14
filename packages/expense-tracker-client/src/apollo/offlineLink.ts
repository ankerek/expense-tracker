/*
 * This link is forked from https://github.com/helfer/apollo-link-queue
 * and extended with custom offline functionality
 */
import {
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  NextLink,
} from 'apollo-link'
import { Observer } from 'zen-observable-ts'
import { CreateAccountMutationName } from '@controllers/account/CreateAccount'
import { CreateTransactionMutationName } from '@controllers/transaction/CreateTransaction'
import { UpdateTransactionMutationName } from '@controllers/transaction/UpdateTransaction'
import { DeleteTransactionMutationName } from '@controllers/transaction/DeleteTransaction'

const isMutationOperation = (operation: Operation) => {
  return (
    operation.query.definitions.filter((e: any) => e.operation === 'mutation')
      .length > 0
  )
}

const opLevels: { [opName: string]: number } = {
  [CreateAccountMutationName]: 0,
  [CreateTransactionMutationName]: 1,
  [UpdateTransactionMutationName]: 1,
  [DeleteTransactionMutationName]: 1,
}

interface OperationQueueEntry {
  operation: Operation
  forward: NextLink
  observer: Observer<FetchResult>
  subscription?: { unsubscribe: () => void }
}

class OfflineLink extends ApolloLink {
  private isOpen = true
  private opQueue: OperationQueueEntry[][] = [[], []]

  public open() {
    this.isOpen = true
    this.runQueue()
  }

  public close() {
    this.isOpen = false
  }

  public request(operation: Operation, forward: NextLink) {
    if (this.isOpen || !isMutationOperation(operation)) {
      return forward(operation)
    }

    return new Observable(observer => {
      const operationEntry = { operation, forward, observer }
      this.enqueue(operationEntry)
      return () => this.cancelOperation(operationEntry)
    })
  }

  private runQueue(level = 0) {
    if (this.opQueue[level].length) {
      this.opQueue[level].forEach(({ operation, forward, observer }) => {
        forward(operation).subscribe(observer)
      })
    } else if (level < this.opQueue.length - 1) {
      this.runQueue(level + 1)
    }
  }

  private cancelOperation(entry: OperationQueueEntry) {
    for (const queue of this.opQueue) {
      const idx = queue.findIndex(e => e === entry)
      if (idx >= 0) {
        queue.splice(idx, 1)
        break
      }
    }

    const opLevel = opLevels[entry.operation.operationName] || 0
    // current queue is empty -> run another
    if (!this.opQueue[opLevel].length) {
      this.runQueue()
    }
  }

  private enqueue(entry: OperationQueueEntry) {
    const opLevel = opLevels[entry.operation.operationName] || 0
    this.opQueue[opLevel].push(entry)
  }
}

export const offlineLink = new OfflineLink()
