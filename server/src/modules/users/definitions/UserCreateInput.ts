import { InputType, Field } from 'type-graphql'
import { User } from './User'

@InputType()
export class UserCreateInput implements Partial<User> {
  @Field()
  email: string
}
