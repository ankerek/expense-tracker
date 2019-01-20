import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '../../user/definitions/User'
import { Account } from '../../account/definitions/Account'

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  // precision: 0 to discard fractional seconds
  @Field()
  createdAt: string

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  description?: string

  @Column({ type: 'numeric', precision: 19, scale: 2 })
  @Field()
  amount: number

  @ManyToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  userId: string

  @ManyToOne(type => Account, { cascade: true })
  @JoinColumn({ name: 'account_id' })
  @Field(type => Account)
  account: Account
  @Column({ name: 'account_id' })
  accountId: Account
}
