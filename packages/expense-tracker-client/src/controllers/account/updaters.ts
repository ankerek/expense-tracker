import { DataProxy } from 'apollo-cache'
import { FetchResult, MutationUpdaterFn } from 'react-apollo'
import {
  GetAccountListQuery,
  SaveAccountMutation,
  Account,
  DeleteAccountMutation,
  GetTransactionListQuery,
} from '@schema-types'
import { getAccountListQuery } from '@controllers/account/GetAccountList'
import { getTransactionListQuery } from '@controllers/transaction/GetTransactionList'

export type SaveAccountMutationUpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: { prevAccount?: Account }
) => void

export const saveAccountUpdater: SaveAccountMutationUpdaterFn<
  SaveAccountMutation
> = (client, { data: { saveAccount } }) => {
  // update account in Account list
  const data: GetAccountListQuery = client.readQuery({
    query: getAccountListQuery,
  })

  const accountIdx = data.getAccountList.findIndex(
    account => account.id === saveAccount.id
  )

  if (accountIdx === -1) {
    data.getAccountList.push(saveAccount)
  } else {
    data.getAccountList[accountIdx] = saveAccount
  }

  client.writeQuery({ query: getAccountListQuery, data })
}

export const deleteAccountUpdater: SaveAccountMutationUpdaterFn<
  DeleteAccountMutation
> = (client, _, { prevAccount }) => {
  // remove the account from the account list
  const accountsData: GetAccountListQuery = client.readQuery({
    query: getAccountListQuery,
  })
  accountsData.getAccountList = accountsData.getAccountList.filter(
    a => a.id !== prevAccount.id
  )
  client.writeQuery({
    query: getAccountListQuery,
    data: accountsData,
  })

  // remove transactions associated to the account from the transaction list
  const transactionsData: GetTransactionListQuery = client.readQuery({
    query: getTransactionListQuery,
  })
  transactionsData.getTransactionList = transactionsData.getTransactionList.filter(
    t => t.account.id !== prevAccount.id
  )
  client.writeQuery({
    query: getTransactionListQuery,
    data: transactionsData,
  })
}
