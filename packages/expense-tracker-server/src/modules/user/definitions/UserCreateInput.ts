import { InputType, Field } from 'type-graphql'
import { User } from './User'
import { SaveCurrencyInput } from '../../currency/definitions/SaveCurrencyInput'

@InputType()
export class UserCreateInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  password: string

  @Field()
  currency: SaveCurrencyInput
}
