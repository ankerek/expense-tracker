import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { SaveCurrencyInput } from './SaveCurrencyInput'

@Entity()
@ObjectType()
export class Currency {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @Column({ type: 'varchar' })
  @Field()
  symbol: string

  constructor(input?: SaveCurrencyInput) {
    if (input) {
      this.id = input.id
      this.symbol = input.symbol
    }
  }
}
