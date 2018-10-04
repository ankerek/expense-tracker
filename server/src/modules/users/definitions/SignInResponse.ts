import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class SignInResponse {
  @Field()
  token: string
}
