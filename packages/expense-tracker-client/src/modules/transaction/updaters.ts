import { FetchResult } from 'react-apollo'
import { DataProxy } from 'apollo-cache'
import {
  SaveTransactionMutation,
  GetTransactionListQuery,
  Transaction,
  DeleteTransactionMutation,
} from '@schema-types'
import { getTransactionListQuery } from '@modules/transaction/GetTransactionList'

export type SaveTransactionMutationUpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: {
    prevTransaction?: Transaction
  }
) => void

export const saveTransactionUpdater: SaveTransactionMutationUpdaterFn<
  SaveTransactionMutation
> = (client, { data: { saveTransaction } }, { prevTransaction } = {}) => {
  // update transaction in Transaction list
  const data: GetTransactionListQuery = client.readQuery({
    query: getTransactionListQuery,
  })

  const transactionIdx = data.getTransactionList.findIndex(
    trans => trans.id === saveTransaction.id
  )

  if (transactionIdx === -1) {
    data.getTransactionList.push(saveTransaction)
  } else {
    data.getTransactionList[transactionIdx] = saveTransaction
  }

  client.writeQuery({ query: getTransactionListQuery, data })

  // @deprecated
  // if (!prevTransaction) {
  //   // update amount of the corresponding account
  //   client.writeFragment({
  //     id: `Account:${saveTransaction.account.id}`,
  //     fragment: accountFragment,
  //     fragmentName: 'Account',
  //     data: {
  //       ...saveTransaction.account,
  //       amount: sum(saveTransaction.account.amount, saveTransaction.amount),
  //     },
  //   })
  // } else {
  //   // update existing transaction
  //
  //   // this num will be added to the account
  //   let newAccountAmountDifference = 0
  //
  //   if (prevTransaction.account.id !== saveTransaction.account.id) {
  //     // transaction has moved to different account
  //     // it's needed to deduct the amount from the prev account
  //     client.writeFragment({
  //       id: `Account:${prevTransaction.account.id}`,
  //       fragment: accountFragment,
  //       fragmentName: 'Account',
  //       data: {
  //         ...prevTransaction.account,
  //         amount: sum(prevTransaction.account.amount, -prevTransaction.amount),
  //       },
  //     })
  //
  //     newAccountAmountDifference = saveTransaction.amount
  //   } else if (prevTransaction.amount !== saveTransaction.amount) {
  //     newAccountAmountDifference = sum(
  //       saveTransaction.amount,
  //       -prevTransaction.amount
  //     )
  //   }
  //
  //   client.writeFragment({
  //     id: `Account:${saveTransaction.account.id}`,
  //     fragment: accountFragment,
  //     fragmentName: 'Account',
  //     data: {
  //       ...saveTransaction.account,
  //       amount: sum(saveTransaction.account.amount, newAccountAmountDifference),
  //     },
  //   })
  // }
}

export const deleteTransactionUpdater: SaveTransactionMutationUpdaterFn<
  DeleteTransactionMutation
> = (client, _, { prevTransaction }) => {
  // remove the transaction from the Transaction list
  const data: GetTransactionListQuery = client.readQuery({
    query: getTransactionListQuery,
  })
  data.getTransactionList = data.getTransactionList.filter(
    t => t.id !== prevTransaction.id
  )
  client.writeQuery({ query: getTransactionListQuery, data })

  // @deprecated
  // update amount of the corresponding account
  // const account: Account = client.readFragment({
  //   id: `Account:${prevTransaction.account.id}`,
  //   fragment: accountFragment,
  //   fragmentName: 'Account',
  // })
  //
  // account.amount = sum(account.amount, -prevTransaction.amount)
  //
  // client.writeFragment({
  //   id: `Account:${account.id}`,
  //   fragment: accountFragment,
  //   fragmentName: 'Account',
  //   data: account,
  // })

  // TODO delete transaction fragment from cache
}
