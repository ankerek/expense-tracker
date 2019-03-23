import { FetchResult, MutationUpdaterFn } from 'react-apollo'
import { DataProxy } from 'apollo-cache'
import {
  Account,
  SaveTransactionMutation,
  GetTransactionListQuery,
  Transaction,
  DeleteAccountMutation,
  DeleteTransactionMutation,
} from '@schema-types'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { accountFragment } from '@controllers/account/fragments'
import { sum } from '@utils/math'

export type SaveTransactionMutationUpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: { prevTransaction?: Transaction }
) => void

export const saveTransactionUpdater: SaveTransactionMutationUpdaterFn<
  SaveTransactionMutation
> = (client, { data: { saveTransaction } }, { prevTransaction } = {}) => {
  // there is no prevTransaction
  // create a new transaction
  if (!prevTransaction) {
    // push new transaction to Transaction list
    const data: GetTransactionListQuery = client.readQuery({
      query: getTransactionListQuery,
    })
    data.getTransactionList.push(saveTransaction)
    client.writeQuery({ query: getTransactionListQuery, data })

    if (!saveTransaction.isPersisted) {
      // update amount of the corresponding account
      const account: Account = client.readFragment({
        id: `Account:${saveTransaction.account.id}`,
        fragment: accountFragment,
        fragmentName: 'Account',
      })

      account.amount = sum(account.amount, saveTransaction.amount)

      client.writeFragment({
        id: `Account:${saveTransaction.account.id}`,
        fragment: accountFragment,
        fragmentName: 'Account',
        data: account,
      })
    }
  } else {
    // update existing transaction
    if (!saveTransaction.isPersisted) {
      // account where the updated transaction belongs to
      const account: Account = client.readFragment({
        id: `Account:${saveTransaction.account.id}`,
        fragment: accountFragment,
        fragmentName: 'Account',
      })

      // this num will be added to the account
      let newAccountAmountDifference = 0

      if (prevTransaction.account.id !== saveTransaction.account.id) {
        // transaction has moved to different account
        // it's needed to deduct the amount from the prev account
        const prevAccount: Account = client.readFragment({
          id: `Account:${prevTransaction.account.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
        })

        prevAccount.amount = sum(prevAccount.amount, -prevTransaction.amount)

        client.writeFragment({
          id: `Account:${prevAccount.id}`,
          fragment: accountFragment,
          fragmentName: 'Account',
          data: prevAccount,
        })

        newAccountAmountDifference = saveTransaction.amount
      } else if (prevTransaction.amount !== saveTransaction.amount) {
        newAccountAmountDifference = sum(
          saveTransaction.amount,
          -prevTransaction.amount
        )
      }

      account.amount = sum(account.amount, newAccountAmountDifference)

      client.writeFragment({
        id: `Account:${saveTransaction.account.id}`,
        fragment: accountFragment,
        fragmentName: 'Account',
        data: account,
      })
    }
  }
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

  // update amount of the corresponding account

  const account: Account = client.readFragment({
    id: `Account:${prevTransaction.account.id}`,
    fragment: accountFragment,
    fragmentName: 'Account',
  })

  account.amount = sum(account.amount, -prevTransaction.amount)

  client.writeFragment({
    id: `Account:${account.id}`,
    fragment: accountFragment,
    fragmentName: 'Account',
    data: account,
  })

  // TODO delete transaction fragment from cache
}
