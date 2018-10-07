import { getRepository, Repository } from 'typeorm'
import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql'
import { Account } from './definitions/Account'
import { CreateAccountInput } from './definitions/CreateAccountInput'

@Resolver()
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
  @Mutation(returns => Account)
  async createAccount(
    @Arg('input') input: CreateAccountInput,
    @Ctx() ctx: Context
  ) {
    const newAccount = new Account()
    newAccount.name = input.name
    newAccount.userId = ctx.user.id
    return this.accountRepository.save(newAccount)
  }
}

export default AccountResolver
