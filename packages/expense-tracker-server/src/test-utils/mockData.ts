import { getRepository } from 'typeorm'
import faker from 'faker'
import uuid from 'uuid'
import { User } from '../modules/user/definitions/User'
import { Currency } from '../modules/currency/definitions/Currency'
import { Account } from '../modules/account/definitions/Account'

export const createMockUser = async () => {
  const user = new User()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  user.currency = new Currency({
    id: 'USD',
    symbol: '$',
  })
  return getRepository(User).save(user)
}

export const createMockAccount = (data: Partial<Account> = {}) => ({
  id: uuid(),
  name: faker.internet.domainName(),
  ...data,
})
