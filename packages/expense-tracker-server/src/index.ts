import express from 'express'
import { createServer } from 'http'
import compression from 'compression'
import dotenv from 'dotenv'
import path from 'path'
import { execute, subscribe } from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { databaseInitializer } from './databaseInitializer'
import { buildSchema } from './utils/buildSchema'
import { getCurrentUser } from './utils/authentification'
import { errorFormatter } from './utils/errorFormatter'

const BUILD_PATH = path.join(
  __dirname,
  '..',
  '..',
  'expense-tracker-client',
  'dist'
)

dotenv.config()
const port = process.env.PORT

const bootstrap = async () => {
  await databaseInitializer()

  const app = express()

  app.use(compression())

  const schema = await buildSchema()

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, ...other }: { req: express.Request }) => {
      const ctx: Context = {
        user: getCurrentUser(req),
      }

      return ctx
    },
    subscriptions: {
      onConnect: () => console.log('Connected to websocket'),
    },
    formatError: errorFormatter,
  })
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  if (process.env.NODE_ENV === 'production') {
    app.get('/service-worker.js', (req, res) => {
      res.sendFile(path.join(BUILD_PATH, 'service-worker.js'))
      res.header(
        'Cache-Control',
        'private, max-age=0, no-cache, no-store, must-revalidate'
      )
      res.header('Expires', '-1')
      res.header('Pragma', 'no-cache')
    })

    app.use('/static', express.static(BUILD_PATH))

    app.get('*', (req, res) =>
      res.sendFile(path.resolve(path.join(BUILD_PATH, 'index.html')))
    )
  }

  const server = createServer(app)

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    console.log(`Subscriptions server is running on ws://localhost:${port}`)

    // tslint:disable:no-unused-expression
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server,
        // path: '/subscriptions',
      }
    )
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
