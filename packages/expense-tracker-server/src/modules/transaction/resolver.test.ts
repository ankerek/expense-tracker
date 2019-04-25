import { Connection, getRepository, Repository } from 'typeorm'
import faker from 'faker'

import { testConnection } from '../../test-utils/testConnection'
import { gCall } from '../../test-utils/gCall'
import {
  createMockUser,
  createMockTransaction,
} from '../../test-utils/mockData'
import { User } from '../user/definitions/User'
import { Transaction } from './definitions/Transaction'

const saveTransactionMutation = `
  mutation SaveTransactionMutation($input: SaveTransactionInput!) {
    saveTransaction(input: $input) {
      id
      createdAt
      amount
    }
  }
`

describe('TransactionResolver', () => {
  let conn: Connection
  let transactionRepository: Repository<Transaction>
  let defaultUser: User

  beforeAll(async () => {
    conn = await testConnection()
    transactionRepository = getRepository(Transaction)
    defaultUser = await createMockUser()
  })

  afterAll(async () => {
    await conn.close()
  })

  it('getTransactions query', async () => {
    const transactions = [
      createMockTransaction({
        userId: defaultUser.id,
      }),
      createMockTransaction({ userId: defaultUser.id }),
    ]

    await transactionRepository.save(transactions)

    const getTransactionListQuery = `
      query GetTransactionListQuery {
        getTransactionList {
          id
          createdAt
          amount
        }
      }
    `

    const response = await gCall({
      source: getTransactionListQuery,
      userId: defaultUser.id,
    })

    transactions.forEach(transaction => {
      expect(response.data.getTransactionList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: transaction.id,
            createdAt: transaction.createdAt,
            amount: transaction.amount,
          }),
        ])
      )
    })
  })

  it('getTransaction query', async () => {
    const transaction = createMockTransaction({
      userId: defaultUser.id,
    })

    await transactionRepository.save(transaction)

    const getTransactionQuery = `
      query GetTransactionQuery($id: ID!) {
        getTransaction(id: $id) {
          id
          createdAt
          amount
        }
      }
    `

    const response = await gCall({
      source: getTransactionQuery,
      variableValues: {
        id: transaction.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        getTransaction: {
          id: transaction.id,
          createdAt: transaction.createdAt,
          amount: transaction.amount,
        },
      },
    })
  })

  it('saveTransaction mutation - create transaction', async () => {
    const transaction = createMockTransaction()

    const response = await gCall({
      source: saveTransactionMutation,
      variableValues: {
        input: transaction,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveTransaction: {
          createdAt: transaction.createdAt,
          amount: transaction.amount,
        },
      },
    })
  })

  it('saveTransaction mutation - update transaction', async () => {
    const transaction = createMockTransaction()

    await gCall({
      source: saveTransactionMutation,
      variableValues: {
        input: transaction,
      },
      userId: defaultUser.id,
    })

    const updatedTransaction = {
      ...transaction,
      amount: faker.random.number(),
    }

    const response = await gCall({
      source: saveTransactionMutation,
      variableValues: {
        input: updatedTransaction,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        saveTransaction: {
          amount: updatedTransaction.amount,
        },
      },
    })
  })

  it('deleteTransaction mutation', async () => {
    const deleteTransactionMutation = `
      mutation DeleteTransactionMutation($id: ID!) {
        deleteTransaction(id: $id)
      }
    `

    const transaction = createMockTransaction()

    await gCall({
      source: saveTransactionMutation,
      variableValues: {
        input: transaction,
      },
      userId: defaultUser.id,
    })

    const response = await gCall({
      source: deleteTransactionMutation,
      variableValues: {
        id: transaction.id,
      },
      userId: defaultUser.id,
    })

    expect(response).toMatchObject({
      data: {
        deleteTransaction: true,
      },
    })

    const dbTransaction = await transactionRepository.findOne(transaction.id)

    expect(dbTransaction).toBeUndefined()
  })
})
