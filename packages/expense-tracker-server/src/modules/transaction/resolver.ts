import { getRepository, Repository, DeleteResult } from 'typeorm'
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
  Subscription,
  Publisher,
  PubSub,
} from 'type-graphql'
import { Transaction } from './definitions/Transaction'
import { Account } from '../account/definitions/Account'
import { Category } from '../category/definitions/Category'
import { SaveTransactionInput } from './definitions/SaveTransactionInput'

@Resolver(of => Transaction)
export class TransactionResolver {
  private transactionRepository: Repository<Transaction>
  private accountRepository: Repository<Account>
  private categoryRepository: Repository<Category>

  constructor() {
    this.transactionRepository = getRepository(Transaction)
    this.accountRepository = getRepository(Account)
    this.categoryRepository = getRepository(Category)
  }

  @FieldResolver(returns => Account)
  async account(@Root() transaction: Transaction) {
    return this.accountRepository.findOne(transaction.accountId)
  }

  @FieldResolver(returns => Category)
  async category(@Root() transaction: Transaction) {
    return this.categoryRepository.findOne(transaction.categoryId)
  }

  @FieldResolver(returns => Boolean)
  async isPersisted() {
    return true
  }

  @Authorized()
  @Query(returns => Transaction)
  async getTransaction(@Arg('id', type => ID) id: string) {
    return this.transactionRepository.findOne(id)
  }

  @Authorized()
  @Query(returns => [Transaction])
  async getTransactionList(
    @Ctx() ctx: Context,
    @Arg('id', type => ID, { nullable: true }) accountId?: string
  ) {
    return this.transactionRepository.find({
      where: { userId: ctx.user.id },
    })
  }

  @Subscription({
    topics: ['TRANSACTION_SAVED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  transactionSaved(
    @Arg('userId') userId: string,
    @Root('transaction') transaction: SaveTransactionInput
  ): Transaction {
    return new Transaction(transaction)
  }

  @Subscription({
    topics: ['TRANSACTION_DELETED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  transactionDeleted(
    @Arg('userId') userId: string,
    @Root('transactionId') transactionId: string
  ): string {
    return transactionId
  }

  @Authorized()
  @Mutation(returns => Transaction)
  async saveTransaction(
    @Arg('input') input: SaveTransactionInput,
    @Ctx() ctx: Context,
    @PubSub('TRANSACTION_SAVED')
    publish: Publisher<{ transaction: SaveTransactionInput; userId: string }>
  ) {
    let newTransaction

    newTransaction = new Transaction(input)
    newTransaction.userId = ctx.user.id

    await publish({ transaction: input, userId: ctx.user.id })

    return this.transactionRepository.save(newTransaction)
  }

  // @deprecated
  @Authorized()
  @Mutation(returns => Transaction)
  async updateTransaction(
    @Arg('id', type => ID) id: string,
    @Arg('input') input: SaveTransactionInput,
    @Ctx() ctx: Context
  ) {
    const transaction = await this.transactionRepository.findOne(id)
    return this.transactionRepository.save({ ...transaction, ...input })
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteTransaction(
    @Arg('id', type => ID) id: string,
    @Ctx() ctx: Context,
    @PubSub('TRANSACTION_DELETED')
    publish: Publisher<{ transactionId: string; userId: string }>
  ) {
    await this.transactionRepository.delete(id)

    await publish({ transactionId: id, userId: ctx.user.id })

    return true
  }
}

export default TransactionResolver
