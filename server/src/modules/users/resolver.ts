import * as bcrypt from 'bcrypt'
import { getRepository, Repository } from 'typeorm'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  Ctx,
} from 'type-graphql'
import { UserInputError } from 'apollo-server'
import { User } from './definitions/User'
import { Account } from '../accounts/definitions/Account'
import { UserCreateInput } from './definitions/UserCreateInput'
import { SignInResponse } from './definitions/SignInResponse'
import { validatePassword, createToken } from '../../utils/authentification'

const SALT_ROUNDS = 10

@Resolver(of => User)
export class UserResolver {
  private userRepository: Repository<User>
  private accountRepository: Repository<Account>

  constructor() {
    this.userRepository = getRepository(User)
    this.accountRepository = getRepository(Account)
  }

  @Authorized()
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

  @Query(returns => User, { nullable: true })
  async getCurrentUser(@Ctx() ctx: Context) {
    if (ctx.user) {
      return this.userRepository.findOne({
        where: { id: ctx.user.id },
      })
    }
  }

  @Mutation(returns => SignInResponse)
  async createUser(@Arg('input') input: UserCreateInput) {
    if (!input.email || !input.password) {
      throw new UserInputError('Missing input.')
    }

    const validationErrors: any = {}
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    })

    if (user) {
      validationErrors.email = 'User with this e-mail already exists.'
      throw new UserInputError(
        'Failed to sign up due to validation errors.',
        validationErrors
      )
    }

    const newUser = new User()
    newUser.email = input.email
    newUser.password = await bcrypt.hash(input.password, SALT_ROUNDS)
    const createdUser = await this.userRepository.save(newUser)

    return { token: createToken(createdUser, '30m'), user: createdUser }
  }

  @Mutation(returns => SignInResponse)
  async signIn(@Arg('input') input: UserCreateInput) {
    if (!input.email || !input.password) {
      throw new UserInputError('Missing input.')
    }

    const validationErrors: any = {}
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    })

    if (!user) {
      validationErrors.email = 'No user found with this e-mail.'
      throw new UserInputError(
        'Failed to login due to validation errors.',
        validationErrors
      )
    }

    const isValid = await validatePassword(input.password, user.password)

    if (!isValid) {
      validationErrors.password = 'Invalid password.'
      throw new UserInputError(
        'Failed to login due to validation errors.',
        validationErrors
      )
    }

    return { token: createToken(user, '30m'), user }
  }
}

export default UserResolver
