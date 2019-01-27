import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Currency } from '../../currency/definitions/Currency'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string

  @Column({ type: 'varchar', length: 320 })
  @Field()
  email: string

  @Column({ type: 'char', length: 60 })
  password: string

  @ManyToOne(type => Currency)
  @JoinColumn({ name: 'currency_id' })
  @Field(type => Currency)
  currency: Currency
  @Column({ name: 'currency_id' })
  currencyId: string
}
