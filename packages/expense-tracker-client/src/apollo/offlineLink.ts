import {
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  NextLink,
} from 'apollo-link'
import { Observer } from 'zen-observable-ts'
import { isMutationOperation } from '@utils/isMutationOperation'
import { SaveAccountMutationName } from '@controllers/account/SaveAccount'
import { DeleteAccountMutationName } from '@controllers/account/DeleteAccount'
import { removeLocalOperation } from '@controllers/network/localOperations'

const DEPENDABLE_MUTATIONS = [SaveAccountMutationName]

const parseDependencies = (context: any) => {
  const dependencies: string[] = []
  if (context.account && !context.account.isPersisted) {
    dependencies.push(`${SaveAccountMutationName}:${context.account.id}`)
  }

  return dependencies
}

interface Job {
  operation: Operation
  forward: NextLink
  observer: Observer<FetchResult>
  subscription?: { unsubscribe: () => void }
  dependencies: string[]
}

class OfflineLink extends ApolloLink {
  private isOpen = true
  private jobQueue: Job[] = []

  public open() {
    this.isOpen = true
    this.runQueue()
  }

  public close() {
    this.isOpen = false
  }

  public request(operation: Operation, forward: NextLink) {
    if (this.isOpen) {
      return forward(operation)
    }

    if (!isMutationOperation(operation)) {
      return
    }

    this.cancelRedundantOperations(operation)

    return new Observable(observer => {
      const operationEntry: Job = {
        operation,
        forward,
        observer,
        dependencies: parseDependencies(operation.getContext()),
      }
      this.enqueue(operationEntry)
      return () => this.cancelOperation(operationEntry)
    })
  }

  private runQueue() {
    this.jobQueue.forEach((job, idx) => {
      this.runJob(idx)
    })
  }

  private runJob(idx: number) {
    const job = this.jobQueue[idx]

    if (job && !job.dependencies.length && !job.subscription) {
      job.subscription = job.forward(job.operation).subscribe(job.observer)
    }
  }

  private cancelOperation(job: Job) {
    const idx = this.jobQueue.findIndex(e => e === job)
    if (idx >= 0) {
      // unsubscribe if it's currently in progress
      if (job.subscription) {
        job.subscription.unsubscribe()
      }
      // remove local operation from localStorage
      removeLocalOperation(job.operation.getContext().operationId)

      // remove job from queue
      this.jobQueue.splice(idx, 1)
    }

    if (
      this.open &&
      DEPENDABLE_MUTATIONS.includes(job.operation.operationName)
    ) {
      this.jobQueue.forEach((e, entryIdx) => {
        const dependencyIdx = e.dependencies.findIndex(
          d =>
            d ===
            `${job.operation.operationName}:${job.operation.variables.input.id}`
        )
        if (dependencyIdx >= 0) {
          e.dependencies.splice(dependencyIdx, 1)

          this.runJob(entryIdx)
        }
      })
    }
  }

  private enqueue(job: Job) {
    this.jobQueue.push(job)
  }

  private cancelRedundantOperations(operation: Operation) {
    this.jobQueue.forEach(job => {
      const jobOperationContext = job.operation.getContext()
      if (
        // jobs of the same operation type
        (job.operation.operationName === operation.operationName &&
          job.operation.variables.input.id === operation.variables.input.id) ||
        // transaction jobs on account delete
        (operation.operationName === DeleteAccountMutationName &&
          jobOperationContext.account &&
          jobOperationContext.account.id === operation.variables.id)
      ) {
        job.observer.error(() => {
          // cancel op
        })
      }
    })
  }
}

export const offlineLink = new OfflineLink()
