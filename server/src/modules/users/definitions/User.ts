import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Account } from '../../accounts/definitions/Account'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  readonly id: string

  @Column({ type: 'varchar', length: 320 })
  @Field()
  email: string

  @Field(type => [Account])
  accounts: Account[]
}
