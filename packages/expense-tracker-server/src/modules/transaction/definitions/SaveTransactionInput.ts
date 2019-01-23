import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'
import { Account } from '../../account/definitions/Account'
import { Transaction } from './Transaction'
import { SaveAccountInput } from '../../account/definitions/SaveAccountInput'

@InputType()
export class SaveTransactionInput {
  @Field()
  id: string

  @Field()
  createdAt: string

  @Field({ nullable: true })
  description?: string

  @Field()
  amount: number

  @Field()
  account: SaveAccountInput
}
