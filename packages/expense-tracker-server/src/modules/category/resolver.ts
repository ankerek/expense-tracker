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

  @Authorized()
  @Mutation(returns => Category)
  async saveCategory(
    @Arg('input') input: SaveCategoryInput,
    @Ctx() ctx: Context
  ) {
    let newCategory
    const existingCategory = await this.categoryRepository.findOne(input.id)

    if (existingCategory) {
      newCategory = { ...existingCategory, ...input }
    } else {
      newCategory = new Category(input)
      newCategory.userId = ctx.user.id
    }

    return this.categoryRepository.save(newCategory)
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteCategory(@Arg('id', type => ID) id: string) {
    await this.categoryRepository.delete(id)
    return true
  }
}

export default AccountResolver
