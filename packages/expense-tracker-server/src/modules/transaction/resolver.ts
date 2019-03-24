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

  @Authorized()
  @Mutation(returns => Transaction)
  async saveTransaction(
    @Arg('input') input: SaveTransactionInput,
    @Ctx() ctx: Context
  ) {
    let newTransaction
    const existingTransaction = await this.transactionRepository.findOne(
      input.id
    )

    if (existingTransaction) {
      newTransaction = {
        ...existingTransaction,
        ...input,
      }
    } else {
      newTransaction = new Transaction(input)
      newTransaction.userId = ctx.user.id
    }

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
  async deleteTransaction(@Arg('id', type => ID) id: string) {
    await this.transactionRepository.delete(id)
    return true
  }
}

export default TransactionResolver
