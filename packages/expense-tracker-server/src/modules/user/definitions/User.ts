import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Account } from '../../account/definitions/Account'

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

  @Field(type => [Account])
  accounts: Account[]
}
