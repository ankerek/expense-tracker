import { Connection, getRepository, Repository } from 'typeorm'
import faker from 'faker'

import { testConnection } from '../../test-utils/testConnection'
import { gCall } from '../../test-utils/gCall'
import { createMockUser, createMockAccount } from '../../test-utils/mockData'
import { User } from '../user/definitions/User'
import { Account } from './definitions/Account'

const saveAccountMutation = `
  mutation SaveAccountMutation($input: SaveAccountInput!) {
    saveAccount(input: $input) {
      id
      name
    }
  }
`

describe('AccountResolver', () => {
  let conn: Connection
  let accountRepository: Repository<Account>
  let defaultUser: User

  beforeAll(async () => {
    conn = await testConnection()
    accountRepository = getRepository(Account)
    defaultUser = await createMockUser()
  })

  afterAll(async () => {
    await conn.close()
  })

  it('getAccounts query', async () => {
    const accounts = [
      createMockAccount({
        userId: defaultUser.id,
      }),
      createMockAccount({ userId: defaultUser.id }),
    ]

    await accountRepository.save(accounts)

    const getAccountListQuery = `
      query GetAccountListQuery {
        getAccountList {
          id
          name
        }
      }
    `

    const response = await gCall({
      source: getAccountListQuery,
      userId: defaultUser.id,
    })

    accounts.forEach(account => {
      expect(response.data.getAccountList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: account.id,
            name: account.name,
          }),
        ])
      )
    })
  })

  it('getAccount query', async () => {
    const account = createMockAccount({
      userId: defaultUser.id,
    })

    await accountRepository.save(account)

    const getAccountQuery = `
      query GetAccountQuery($id: ID!) {
        getAccount(id: $id) {
          id
          name
        }
      }
    `

    const response = await gCall({
      source: getAccountQuery,
      variableValues: {
        id: account.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        getAccount: {
          id: account.id,
          name: account.name,
        },
      },
    })
  })

  it('saveAccount mutation - create account', async () => {
    const account = createMockAccount()

    const response = await gCall({
      source: saveAccountMutation,
      variableValues: {
        input: account,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveAccount: {
          name: account.name,
        },
      },
    })
  })

  it('saveAccount mutation - update account', async () => {
    const account = createMockAccount()

    await gCall({
      source: saveAccountMutation,
      variableValues: {
        input: account,
      },
      userId: defaultUser.id,
    })

    const updatedAccount = {
      ...account,
      name: faker.internet.domainName(),
    }

    const response = await gCall({
      source: saveAccountMutation,
      variableValues: {
        input: updatedAccount,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveAccount: {
          name: updatedAccount.name,
        },
      },
    })
  })

  it('deleteAccount mutation', async () => {
    const deleteAccountMutation = `
      mutation DeleteAccountMutation($id: ID!) {
        deleteAccount(id: $id)
      }
    `

    const account = createMockAccount()

    await gCall({
      source: saveAccountMutation,
      variableValues: {
        input: account,
      },
      userId: defaultUser.id,
    })

    const response = await gCall({
      source: deleteAccountMutation,
      variableValues: {
        id: account.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        deleteAccount: true,
      },
    })

    const dbAccount = await accountRepository.findOne(account.id)

    expect(dbAccount).toBeUndefined()
  })
})
