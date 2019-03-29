import { GraphQLError } from 'graphql'
import { AuthenticationError } from 'apollo-server'
import { UnauthorizedError } from 'type-graphql'

export const errorFormatter = (error: GraphQLError) => {
  if (error && error.message === new UnauthorizedError().message) {
    return new AuthenticationError(error.message)
  }
  return error
}
