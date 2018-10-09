import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'
import { Account } from './Account'

@InputType()
export class CreateAccountInput implements Partial<Account> {
  @Field()
  @MinLength(1)
  name: string

  @Field()
  @MinLength(3)
  currency: string
}
