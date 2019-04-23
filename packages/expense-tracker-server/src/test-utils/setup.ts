import { getRepository } from 'typeorm'
import { testConnection } from './testConnection'
import { Currency } from '../modules/currency/definitions/Currency'

const setup = async () => {
  await testConnection(true)

  await getRepository(Currency).save(new Currency({ id: 'USD', symbol: '$' }))

  process.exit()
}

setup()
