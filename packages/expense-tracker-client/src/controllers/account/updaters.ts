import { MutationUpdaterFn } from 'react-apollo'
import { GetAccountListQuery, SaveAccountMutation } from '@schema-types'
import { getAccountListQuery } from '@controllers/account/GetAccountList'

export const createAccountUpdater: MutationUpdaterFn<SaveAccountMutation> = (
  client,
  { data: { saveAccount } }
) => {
  // push new transaction to Account list
  const data: GetAccountListQuery = client.readQuery({
    query: getAccountListQuery,
  })

  data.getAccountList.push(saveAccount)

  client.writeQuery({ query: getAccountListQuery, data })
}
