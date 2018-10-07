import { Field, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class SignInResponse {
  @Field()
  token: string

  @Field()
  user: User
}
