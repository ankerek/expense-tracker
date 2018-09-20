import { getRepository, Repository } from 'typeorm'
import { Resolver, Query, Mutation } from 'type-graphql'
import { Account } from './definitions/Account'

@Resolver()
export class AccountResolver {
  private accountRepository: Repository<Account>

  constructor() {
    this.accountRepository = getRepository(Account)
  }

  @Query(returns => [Account])
  async accounts() {
    return this.accountRepository.find()
  }

  @Mutation(returns => Account)
  async createAccount(/*@Arg('data') newUserData: UserCreateInput*/) {
    const newAccount = new Account()
    newAccount.name = 'test'
    newAccount.userId = 'c15bb2bf-7ca2-445b-85a9-c0d846ae9883'
    return this.accountRepository.save(newAccount)
  }
}

export default AccountResolver
