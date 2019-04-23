import { Connection, getRepository, Repository } from 'typeorm'
import faker from 'faker'
import uuid from 'uuid'

import { testConnection } from '../../test-utils/testConnection'
import { gCall } from '../../test-utils/gCall'
import { createUser } from '../../test-utils/mockData'
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

describe('UserResolver', () => {
  let conn: Connection
  let accountRepository: Repository<Account>
  let defaultUser: User

  beforeAll(async () => {
    conn = await testConnection()
    accountRepository = getRepository(Account)
    defaultUser = await createUser()
  })

  afterAll(async () => {
    await conn.close()
  })

  it('saveAccount mutation - create account', async () => {
    const account = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

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
    const account = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

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

    const account = {
      id: uuid(),
      name: faker.internet.domainName(),
    }

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
