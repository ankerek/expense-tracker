import { getRepository, Repository } from 'typeorm'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from 'type-graphql'
import { User } from './definitions/User'
import { UserCreateInput } from './definitions/UserCreateInput'
import { Account } from '../accounts/definitions/Account'

@Resolver(of => User)
export class UserResolver {
  private userRepository: Repository<User>
  private accountRepository: Repository<Account>

  constructor() {
    this.userRepository = getRepository(User)
    this.accountRepository = getRepository(Account)
  }

  @Query(returns => [User])
  async users() {
    return this.userRepository.find()
  }

  @FieldResolver(returns => [Account])
  async accounts(@Root() user: User) {
    const accounts = await this.accountRepository.find({
      where: { userId: user.id },
    })
    return accounts
  }

  @Mutation(returns => User)
  async createUser(@Arg('data') newUserData: UserCreateInput) {
    return this.userRepository.save(newUserData)
  }
}

export default UserResolver
