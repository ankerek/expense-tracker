import { createConnection, EntitySchema } from 'typeorm'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const getEntities = () => {
  let entities: EntitySchema[] = []
  fs.readdirSync(path.join(__dirname, 'modules')).forEach(folder => {
    const currentEntities = require(`./modules/${folder}/entities`).default
    entities = [...entities, ...currentEntities]
  })
  return entities
}

const connectionUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
      process.env.DB_HOST
    }/${process.env.DB_NAME}`

export const databaseInitializer = async () => {
  return createConnection({
    type: 'postgres',
    url: connectionUrl,
    ssl: {
      sslfactory: 'org.postgresql.ssl.NonValidatingFactory',
    },
    entities: getEntities(),
    synchronize: true,
  })
    .then(async connection => {
      console.log('Connection has been established successfully.')
    })
    .catch(error => console.log(error))
}
