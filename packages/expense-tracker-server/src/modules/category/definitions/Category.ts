import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID, Float } from 'type-graphql'
import { User } from '../../user/definitions/User'
import { SaveCategoryInput } from './SaveCategoryInput'

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column({ type: 'varchar' })
  @Field()
  name: string

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: string

  constructor(input?: SaveCategoryInput & { userId?: string }) {
    if (input) {
      this.id = input.id
      this.name = input.name
      this.userId = input.userId
    }
  }
}
