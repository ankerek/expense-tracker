import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID, Float } from 'type-graphql'
import { User } from '../../user/definitions/User'
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

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: string

  constructor(input?: SaveAccountInput & { userId?: string }) {
    if (input) {
      this.id = input.id
      this.name = input.name
      this.userId = input.userId
    }
  }
}
