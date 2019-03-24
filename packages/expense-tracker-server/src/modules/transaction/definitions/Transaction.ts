import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '../../user/definitions/User'
import { Account } from '../../account/definitions/Account'
import { Category } from '../../category/definitions/Category'
import { SaveTransactionInput } from './SaveTransactionInput'

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column({
    name: 'created_at',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  @Field()
  createdAt: string

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  description?: string

  @Column({ type: 'numeric', precision: 19, scale: 2 })
  @Field()
  amount: number

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId?: string

  @ManyToOne(type => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  @Field(type => Account)
  account: Account
  @Column({ name: 'account_id' })
  accountId?: string

  @ManyToOne(type => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  @Field(type => Category)
  category: Category
  @Column({ name: 'category_id' })
  categoryId?: string

  constructor(input?: SaveTransactionInput) {
    if (input) {
      this.id = input.id
      this.createdAt = input.createdAt
      this.description = input.description
      this.amount = input.amount
      this.account = new Account(input.account)
      this.category = new Category(input.category)
    }
  }
}
