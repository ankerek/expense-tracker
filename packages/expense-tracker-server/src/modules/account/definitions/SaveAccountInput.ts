import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'
import { SaveCurrencyInput } from '../../currency/definitions/SaveCurrencyInput'

@InputType()
export class SaveAccountInput {
  @Field({ nullable: true })
  id?: string

  @Field()
  @MinLength(1)
  name: string

  @Field()
  currency: SaveCurrencyInput
}
