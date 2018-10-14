import { getRepository, Repository } from 'typeorm'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  ID,
} from 'type-graphql'
import { Account } from './definitions/Account'
import { SaveAccountInput } from './definitions/SaveAccountInput'

@Resolver(of => Account)
export class AccountResolver {
  private accountRepository: Repository<Account>

  constructor() {
    this.accountRepository = getRepository(Account)
  }

  @Authorized()
  @Query(returns => [Account])
  async getAccountList(@Ctx() ctx: Context) {
    return this.accountRepository.find({
      where: { userId: ctx.user.id },
    })
  }

  @Authorized()
  @Query(returns => Account)
  async getAccount(@Arg('id', type => ID) id: string) {
    return this.accountRepository.findOne(id)
  }

  @Authorized()
  @Mutation(returns => Account)
  async createAccount(
    @Arg('input') input: SaveAccountInput,
    @Ctx() ctx: Context
  ) {
    const newAccount = new Account()
    newAccount.name = input.name
    newAccount.currency = input.currency
    newAccount.userId = ctx.user.id
    return this.accountRepository.save(newAccount)
  }

  @Authorized()
  @Mutation(returns => Account)
  async updateAccount(
    @Arg('id', type => ID) id: string,
    @Arg('input') input: SaveAccountInput,
    @Ctx() ctx: Context
  ) {
    const account = await this.accountRepository.findOne(id)
    return this.accountRepository.save({ ...account, ...input })
  }
}

export default AccountResolver
