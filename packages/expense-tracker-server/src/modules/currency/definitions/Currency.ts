import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@Entity()
@ObjectType()
export class Currency {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @Column({ type: 'varchar' })
  @Field()
  symbol: string
}
