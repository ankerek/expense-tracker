import { GraphQLError } from 'graphql'

export interface NormalizedErrorsMap {
  [key: string]: string
}

export const normalizeErrors = (graphqlErrors: GraphQLError[]) =>
  graphqlErrors.reduce((acc: NormalizedErrorsMap, curr) => {
    return {
      ...acc,
      ...curr.extensions.exception,
    }
  }, {})
