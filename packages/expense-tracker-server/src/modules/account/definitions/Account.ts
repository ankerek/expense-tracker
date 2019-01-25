import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID, Float } from 'type-graphql'
import { User } from '../../user/definitions/User'
import { Currency } from '../../currency/definitions/Currency'
import { Transaction } from '../../transaction/definitions/Transaction'
import { SaveAccountInput } from './SaveAccountInput'

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

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

  // @Field(type => [Transaction])
  // transactions: Transaction[]
  //
  // @Field(type => Float)
  // amount: number

  constructor(input?: SaveAccountInput) {
    if (input) {
      this.id = input.id
      this.name = input.name
      this.currency = new Currency(input.currency)
    }
  }
}
