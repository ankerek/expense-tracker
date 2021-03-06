import { InputType, Field } from 'type-graphql'
import { User } from './User'

@InputType()
export class SignInInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  password: string
}
