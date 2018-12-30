import express from 'express'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { databaseInitializer } from './databaseInitializer'
import { asyncMiddleware } from './utils/asyncMiddleware'
import { buildSchema } from './utils/buildSchema'
import { getCurrentUser } from './utils/authentification'

dotenv.config()
const port = process.env.API_PORT

const bootstrap = async () => {
  await databaseInitializer()

  const app = express()

  app.listen(port, () => {
    console.log(`server is listening on ${port}`)
  })

  const schema = await buildSchema()

  const server = new ApolloServer({
    schema,
    context: ({ req, ...other }: { req: express.Request }) => {
      const ctx: Context = {
        user: getCurrentUser(req),
      }

      return ctx
    },
  })
  server.applyMiddleware({ app, path: '/graphql' })

  app.get(
    '/test',
    asyncMiddleware(async (req, res, next) => {
      /*
      if there is an error thrown in getUserFromDb, asyncMiddleware
      will pass it to next() and express will handle the error;
    */
      res.send('hello world')
    })
  )
}

bootstrap().catch(err => console.log(err))
