import { getRepository, Repository } from 'typeorm'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  ID,
  FieldResolver,
  Root,
  Float,
} from 'type-graphql'
import { Account } from './definitions/Account'
import { Currency } from '../currency/definitions/Currency'
import { Transaction } from '../transaction/definitions/Transaction'
import { SaveAccountInput } from './definitions/SaveAccountInput'

@Resolver(of => Account)
export class AccountResolver {
  private accountRepository: Repository<Account>
  private transactionRepository: Repository<Transaction>

  constructor() {
    this.accountRepository = getRepository(Account)
    this.transactionRepository = getRepository(Transaction)
  }

  @FieldResolver(returns => [Transaction])
  async transactions(@Root() account: Account) {
    return this.transactionRepository.find({ where: { accountId: account.id } })
  }

  @FieldResolver(type => Float)
  async amount(@Root() account: Account) {
    const { sum } = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'sum')
      .where('transaction.accountId = :id', { id: account.id })
      .getRawOne()

    return sum || 0
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
    const newAccount = new Account(input)
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

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteAccount(@Arg('id', type => ID) id: string) {
    await this.accountRepository.delete(id)
    return true
  }
}

export default AccountResolver
