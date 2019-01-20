import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'
import { Currency } from './Currency'

@InputType()
export class SaveCurrencyInput implements Partial<Currency> {
  @Field()
  @MinLength(3)
  id: string

  @Field()
  @MinLength(1)
  symbol: string
}
