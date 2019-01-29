import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import { databaseInitializer } from './databaseInitializer'
import { buildSchema } from './utils/buildSchema'
import { getCurrentUser } from './utils/authentification'

const BUILD_PATH = path.join(
  __dirname,
  '..',
  '..',
  'expense-tracker-client',
  'dist'
)

dotenv.config()
const port = process.env.API_PORT

const bootstrap = async () => {
  await databaseInitializer()

  const app = express()

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

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(BUILD_PATH))
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(path.join(BUILD_PATH, 'index.html')))
    )
  }

  app.listen(port, () => {
    console.log(`server is listening on ${port}`)
  })

  // app.get(
  //   '/test',
  //   asyncMiddleware(async (req, res, next) => {
  //     /*
  //     if there is an error thrown in getUserFromDb, asyncMiddleware
  //     will pass it to next() and express will handle the error;
  //   */
  //     res.send('hello world')
  //   })
  // )
}

bootstrap().catch(err => console.log(err))
