import { graphql, GraphQLSchema } from 'graphql'
import Maybe from 'graphql/tsutils/Maybe'
import { buildSchema } from '../utils/buildSchema'

interface Options {
  source: string
  variableValues?: Maybe<{
    [key: string]: any
  }>
  userId?: string
}

let schema: GraphQLSchema

export const gCall = async ({ source, variableValues, userId }: Options) => {
  if (!schema) {
    schema = await buildSchema()
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      user: {
        id: userId,
      },
    },
  })
}
