import { DataProxy } from 'apollo-cache'
import { FetchResult } from 'react-apollo'
import {
  GetCategoryListQuery,
  SaveCategoryMutation,
  Category,
  DeleteCategoryMutation,
  GetTransactionListQuery,
} from '@schema-types'
import { getCategoryListQuery } from '@modules/category/GetCategoryList'
import { getTransactionListQuery } from '@modules/transaction/GetTransactionList'

export type CategoryMutationUpdaterFn<
  T = {
    [key: string]: any
  }
> = (
  proxy: DataProxy,
  mutationResult: FetchResult<T>,
  otherOptions?: { prevCategory?: Category }
) => void

export const saveCategoryUpdater: CategoryMutationUpdaterFn<
  SaveCategoryMutation
> = (client, { data: { saveCategory } }, { prevCategory } = {}) => {
  // replace category in Category list
  const data: GetCategoryListQuery = client.readQuery({
    query: getCategoryListQuery,
  })

  const categoryIdx = data.getCategoryList.findIndex(
    cat => cat.id === saveCategory.id
  )

  if (categoryIdx === -1) {
    data.getCategoryList.push(saveCategory)
  } else {
    data.getCategoryList[categoryIdx] = saveCategory
  }

  client.writeQuery({ query: getCategoryListQuery, data })
}

export const deleteCategoryUpdater: CategoryMutationUpdaterFn<
  DeleteCategoryMutation
> = (client, _, { prevCategory }) => {
  // remove the account from the account list
  const categoryList: GetCategoryListQuery = client.readQuery({
    query: getCategoryListQuery,
  })
  categoryList.getCategoryList = categoryList.getCategoryList.filter(
    a => a.id !== prevCategory.id
  )
  client.writeQuery({
    query: getCategoryListQuery,
    data: categoryList,
  })

  // remove transactions associated to the account from the transaction list
  const transactionsData: GetTransactionListQuery = client.readQuery({
    query: getTransactionListQuery,
  })
  transactionsData.getTransactionList = transactionsData.getTransactionList.filter(
    t => t.category.id !== prevCategory.id
  )
  client.writeQuery({
    query: getTransactionListQuery,
    data: transactionsData,
  })
}
