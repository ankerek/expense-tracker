// tslint:disable:no-empty
import { DataProxy } from 'apollo-cache'
import { FetchResult } from 'react-apollo'
import {
  saveAccountUpdater,
  deleteAccountUpdater,
} from '@modules/account/updaters'
import { deleteCategoryUpdater, saveCategoryUpdater } from './category/updaters'
import {
  saveTransactionUpdater,
  deleteTransactionUpdater,
} from '@modules/transaction/updaters'

export type UpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: any
) => void

export const getUpdater = (response: any): UpdaterFn => {
  // accounts
  if (response.data.saveAccount) {
    return saveAccountUpdater
  }

  if (response.data.deleteAccount) {
    return deleteAccountUpdater
  }

  // categories
  if (response.data.saveCategory) {
    return saveCategoryUpdater
  }

  if (response.data.deleteCategory) {
    return deleteCategoryUpdater
  }

  // transactions
  if (response.data.saveTransaction) {
    return saveTransactionUpdater
  }

  if (response.data.deleteTransaction) {
    return deleteTransactionUpdater
  }

  return () => {}
}
