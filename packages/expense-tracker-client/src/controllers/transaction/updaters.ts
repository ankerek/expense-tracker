import { FetchResult, MutationUpdaterFn } from 'react-apollo'
import { DataProxy } from 'apollo-cache'
import {
  Account,
  SaveTransactionMutation,
  GetTransactionListQuery,
  Transaction,
  DeleteTransactionMutation,
  Category,
} from '@schema-types'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'
import { accountFragment } from '@controllers/account/fragments'
import { sum } from '@utils/math'
import { categoryFragment } from '@controllers/category/fragments'

export type SaveTransactionMutationUpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: {
    prevAccount?: Account
    prevCategory?: Category
    prevTransaction?: Transaction
  }
) => void

export const saveTransactionUpdater: SaveTransactionMutationUpdaterFn<
  SaveTransactionMutation
> = (
  client,
  { data: { saveTransaction } },
  { prevAccount, prevCategory, prevTransaction } = {}
) => {
  // there is no prevTransaction
  // create a new transaction
  if (!prevTransaction) {
    // push new transaction to Transaction list
    const data: GetTransactionListQuery = client.readQuery({
      query: getTransactionListQuery,
    })
    data.getTransactionList.push(saveTransaction)
    client.writeQuery({ query: getTransactionListQuery, data })

    // update amount of the corresponding account
    client.writeFragment({
      id: `Account:${saveTransaction.account.id}`,
      fragment: accountFragment,
      fragmentName: 'Account',
      data: {
        ...prevAccount,
        amount: sum(prevAccount.amount, saveTransaction.amount),
      },
    })
  } else {
    // update existing transaction

    // this num will be added to the account
    let newAccountAmountDifference = 0

    if (prevTransaction.account.id !== saveTransaction.account.id) {
      // transaction has moved to different account
      // it's needed to deduct the amount from the prev account
      client.writeFragment({
        id: `Account:${prevTransaction.account.id}`,
        fragment: accountFragment,
        fragmentName: 'Account',
        data: {
          ...prevTransaction.account,
          amount: sum(prevTransaction.account.amount, -prevTransaction.amount),
        },
      })

      newAccountAmountDifference = saveTransaction.amount
    } else if (prevTransaction.amount !== saveTransaction.amount) {
      newAccountAmountDifference = sum(
        saveTransaction.amount,
        -prevTransaction.amount
      )
    }

    client.writeFragment({
      id: `Account:${saveTransaction.account.id}`,
      fragment: accountFragment,
      fragmentName: 'Account',
      data: {
        ...prevAccount,
        amount: sum(prevAccount.amount, newAccountAmountDifference),
      },
    })

    // this num will be added to the category
    let newCategoryAmountDifference = 0

    if (prevTransaction.category.id !== saveTransaction.category.id) {
      // transaction has moved to different category
      // it's needed to deduct the amount from the prev category
      client.writeFragment({
        id: `Category:${prevTransaction.category.id}`,
        fragment: categoryFragment,
        fragmentName: 'Category',
        data: {
          ...prevTransaction.category,
          amount: sum(
            prevTransaction.category.amount,
            -prevTransaction.category.amount
          ),
        },
      })

      newCategoryAmountDifference = saveTransaction.amount
    } else if (prevTransaction.category !== saveTransaction.category) {
      newCategoryAmountDifference = sum(
        saveTransaction.amount,
        -prevTransaction.amount
      )
    }

    client.writeFragment({
      id: `Category:${saveTransaction.category.id}`,
      fragment: categoryFragment,
      fragmentName: 'Category',
      data: {
        ...prevCategory,
        amount: sum(prevCategory.amount, newCategoryAmountDifference),
      },
    })
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
