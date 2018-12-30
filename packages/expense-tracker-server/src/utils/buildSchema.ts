import fs from 'fs'
import path from 'path'
import { buildSchema as buildFinalSchema } from 'type-graphql'

export const buildSchema = () => {
  const resolvers: Function[] = []
  const folders = fs.readdirSync(path.join(__dirname, '../modules'))
  folders.forEach(folder => {
    const resolver = require(`../modules/${folder}/resolver`).default
    resolvers.push(resolver)
  })

  return buildFinalSchema({
    resolvers,
    authChecker: ({ root, args, context, info }) => {
      return !!context.user
    },
    validate: true,
  })
}
