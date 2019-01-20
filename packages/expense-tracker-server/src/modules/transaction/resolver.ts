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
} from 'type-graphql'
import { Transaction } from './definitions/Transaction'
import { Account } from '../account/definitions/Account'
import { User } from '../user/definitions/User'
// import { SaveAccountInput } from './definitions/SaveAccountInput'

@Resolver(of => Transaction)
export class AccountResolver {
  private transactionRepository: Repository<Transaction>
  private accountRepository: Repository<Account>

  constructor() {
    this.transactionRepository = getRepository(Transaction)
    this.accountRepository = getRepository(Account)
  }

  @FieldResolver(returns => Account)
  async account(@Root() transaction: Transaction) {
    return this.accountRepository.findOne(transaction.accountId)
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
}

export default AccountResolver
