import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'
import { Account } from './Account'
import { SaveCurrencyInput } from '../../currency/definitions/SaveCurrencyInput'

@InputType()
export class SaveAccountInput implements Partial<Account> {
  @Field()
  id: string

  @Field()
  @MinLength(1)
  name: string

  @Field()
  currency: SaveCurrencyInput
}
