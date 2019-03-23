// tslint:disable:no-empty
import { DataProxy } from 'apollo-cache'
import { FetchResult } from 'react-apollo'
import {
  saveAccountUpdater,
  deleteAccountUpdater,
} from '@controllers/account/updaters'
import {
  saveTransactionUpdater,
  deleteTransactionUpdater,
} from '@controllers/transaction/updaters'

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
  if (response.data.saveTransaction) {
    return saveTransactionUpdater
  }

  if (response.data.deleteTransaction) {
    return deleteTransactionUpdater
  }

  if (response.data.saveAccount) {
    return saveAccountUpdater
  }

  if (response.data.deleteAccount) {
    return deleteAccountUpdater
  }

  return () => {}
}
