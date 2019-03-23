import { Operation } from 'apollo-link'

export const isMutationOperation = (operation: Operation) =>
  operation.query.definitions.some((e: any) => e.operation === 'mutation')
