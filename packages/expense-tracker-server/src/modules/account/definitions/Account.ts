import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { User } from '../../user/definitions/User'

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: string

  @Column({ type: 'varchar' })
  @Field()
  name: string

  @ManyToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  userId: string
}
