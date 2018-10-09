import { getRepository, Repository } from 'typeorm'
import { Resolver, Query, Ctx, Authorized } from 'type-graphql'
import { Currency } from './definitions/Currency'

@Resolver()
export class CurrencyResolver {
  private currencyRepository: Repository<Currency>

  constructor() {
    this.currencyRepository = getRepository(Currency)
  }

  @Authorized()
  @Query(returns => [Currency])
  async getCurrencyList(@Ctx() ctx: Context) {
    return this.currencyRepository.find()
  }
}

export default CurrencyResolver
