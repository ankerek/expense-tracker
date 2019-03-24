import { InputType, Field } from 'type-graphql'
import { SaveAccountInput } from '../../account/definitions/SaveAccountInput'
import { SaveCategoryInput } from '../../category/definitions/SaveCategoryInput'

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

  @Field()
  category: SaveCategoryInput
}
