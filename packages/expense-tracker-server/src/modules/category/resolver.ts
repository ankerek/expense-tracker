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
  Subscription,
  Root,
  PubSub,
  Publisher,
} from 'type-graphql'
import { Transaction } from '../transaction/definitions/Transaction'
import { SaveCategoryInput } from './definitions/SaveCategoryInput'
import { Category } from './definitions/Category'

@Resolver(of => Category)
export class AccountResolver {
  private categoryRepository: Repository<Category>
  private transactionRepository: Repository<Transaction>

  constructor() {
    this.categoryRepository = getRepository(Category)
    this.transactionRepository = getRepository(Transaction)
  }

  @FieldResolver(returns => Boolean)
  async isPersisted() {
    return true
  }

  @Authorized()
  @Query(returns => [Category])
  async getCategoryList(@Ctx() ctx: Context) {
    return this.categoryRepository.find({
      where: { userId: ctx.user.id },
    })
  }

  @Authorized()
  @Query(returns => Category)
  async getCategory(@Arg('id', type => ID) id: string) {
    return this.categoryRepository.findOne(id)
  }

  @Subscription({
    topics: ['CATEGORY_SAVED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  categorySaved(
    @Arg('userId', type => ID) userId: string,
    @Root('category') category: SaveCategoryInput
  ): Category {
    return new Category(category)
  }

  @Subscription({
    topics: ['CATEGORY_DELETED'],
    filter: ({ payload, args }) => {
      return payload.userId === args.userId
    },
  })
  categoryDeleted(
    @Arg('userId', type => ID) userId: string,
    @Root('categoryId') categoryId: string
  ): string {
    return categoryId
  }

  @Authorized()
  @Mutation(returns => Category)
  async saveCategory(
    @Arg('input') input: SaveCategoryInput,
    @Ctx() ctx: Context,
    @PubSub('CATEGORY_SAVED')
    publish: Publisher<{ category: SaveCategoryInput; userId: string }>
  ) {
    const newCategory = new Category(input)
    newCategory.userId = ctx.user.id

    await publish({ category: input, userId: ctx.user.id })

    return this.categoryRepository.save(newCategory)
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteCategory(
    @Arg('id', type => ID) id: string,
    @Ctx() ctx: Context,
    @PubSub('CATEGORY_DELETED')
    publishDeleteCategory: Publisher<{ categoryId: string; userId: string }>,
    @PubSub('TRANSACTION_DELETED')
    publishDeleteTransaction: Publisher<{
      transactionId: string
      userId: string
    }>
  ) {
    const transactions = await this.transactionRepository.find({
      where: { categoryId: id },
    })

    await this.categoryRepository.delete(id)

    await publishDeleteCategory({ categoryId: id, userId: ctx.user.id })

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
