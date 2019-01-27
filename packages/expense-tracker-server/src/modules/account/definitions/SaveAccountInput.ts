import { InputType, Field } from 'type-graphql'
import { MinLength } from 'class-validator'

@InputType()
export class SaveAccountInput {
  @Field({ nullable: true })
  id?: string

  @Field()
  @MinLength(1)
  name: string

  @Field({ nullable: true })
  amount: number
}
