import { Connection, getRepository, Repository } from 'typeorm'
import faker from 'faker'
import { testConnection } from '../../test-utils/testConnection'
import { gCall } from '../../test-utils/gCall'
import { createUser } from '../../test-utils/mockData'
import { User } from './definitions/User'

describe('UserResolver', () => {
  let conn: Connection
  let userRepository: Repository<User>
  let defaultUser: User

  beforeAll(async () => {
    conn = await testConnection()
    userRepository = getRepository(User)
    defaultUser = await createUser()
  })

  afterAll(async () => {
    await conn.close()
  })

  it('createUser mutation', async () => {
    const createUserMutation = `
      mutation CreateUserMutation($input: UserCreateInput!) {
        createUser(input: $input) {
          token
          user {
            id
            email
            currency {
              id
              symbol
            }
          }
        }
      }
    `

    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      currency: {
        id: 'USD',
        symbol: '$',
      },
    }

    const response = await gCall({
      source: createUserMutation,
      variableValues: {
        input: user,
      },
    })

    expect(response).toMatchObject({
      data: {
        createUser: {
          user: {
            email: user.email,
          },
        },
      },
    })

    const dbUser = await userRepository.findOne({
      where: { email: user.email },
    })

    expect(dbUser).toBeDefined()
    expect(dbUser.currencyId).toBe(user.currency.id)
  })

  it('getCurrentUser query', async () => {
    const getCurrentUserQuery = `
      query GetCurrentUser {
        getCurrentUser {
          id
          email
        }
      }
    `

    const getCurrentUserResponse = await gCall({
      source: getCurrentUserQuery,
      userId: defaultUser.id,
    })

    expect(getCurrentUserResponse).toMatchObject({
      data: {
        getCurrentUser: {
          id: defaultUser.id,
          email: defaultUser.email,
        },
      },
    })
  })
})
