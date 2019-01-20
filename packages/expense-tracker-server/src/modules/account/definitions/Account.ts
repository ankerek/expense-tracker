import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '../../user/definitions/User'
import { Currency } from '../../currency/definitions/Currency'

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  readonly id: string

  @Column({ type: 'varchar' })
  @Field()
  name: string

  @ManyToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  userId: string

  @ManyToOne(type => Currency, { cascade: true })
  @JoinColumn({ name: 'currency_id' })
  @Field(type => Currency)
  currency: Currency
  @Column({ name: 'currency_id' })
  currencyId: string
}
