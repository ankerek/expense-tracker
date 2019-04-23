import faker from 'faker'
import { getRepository } from 'typeorm'
import { User } from '../modules/user/definitions/User'
import { Currency } from '../modules/currency/definitions/Currency'

export const createUser = async () => {
  const user = new User()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  user.currency = new Currency({
    id: 'USD',
    symbol: '$',
  })
  return getRepository(User).save(user)
}
