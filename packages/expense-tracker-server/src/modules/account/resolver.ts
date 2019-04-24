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
  Subscription,
  PubSub,
  Publisher,
} from 'type-graphql'
import { Account } from './definitions/Account'
import { Transaction } from '../transaction/definitions/Transaction'
import { SaveAccountInput } from './definitions/SaveAccountInput'
import { SaveTransactionInput } from '../transaction/definitions/SaveTransactionInput'

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

  @FieldResolver(returns => Boolean)
  async isPersisted() {
    return true
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

  @Subscription({
    topics: ['ACCOUNT_SAVED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  accountSaved(
    @Arg('userId', type => ID) userId: string,
    @Root('account') account: SaveAccountInput
  ): Account {
    return new Account(account)
  }

  @Subscription({
    topics: ['ACCOUNT_DELETED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  accountDeleted(
    @Arg('userId', type => ID) userId: string,
    @Root('accountId') accountId: string
  ): string {
    return accountId
  }

  @Authorized()
  @Mutation(returns => Account)
  async saveAccount(
    @Arg('input') input: SaveAccountInput,
    @Ctx() ctx: Context,
    @PubSub('ACCOUNT_SAVED')
    publish: Publisher<{ account: SaveAccountInput; userId: string }>
  ) {
    const newAccount = new Account(input)
    newAccount.userId = ctx.user.id

    await publish({ account: input, userId: ctx.user.id })

    return this.accountRepository.save(newAccount)
  }

  // @deprecated
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
  async deleteAccount(
    @Arg('id', type => ID) id: string,
    @Ctx() ctx: Context,
    @PubSub('ACCOUNT_DELETED')
    publishDeleteAccount: Publisher<{ accountId: string; userId: string }>,
    @PubSub('TRANSACTION_DELETED')
    publishDeleteTransaction: Publisher<{
      transactionId: string
      userId: string
    }>
  ) {
    const transactions = await this.transactionRepository.find({
      where: { accountId: id },
    })

    await this.accountRepository.delete(id)

    await publishDeleteAccount({ accountId: id, userId: ctx.user.id })

    if (transactions.length) {
      for (let i = 0; i < transactions.length; i++) {
        await publishDeleteTransaction({
          transactionId: transactions[i].id,
          userId: ctx.user.id,
        })
      }
    }

    return true
  }
}

export default AccountResolver
