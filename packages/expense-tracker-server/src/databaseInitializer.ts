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

export const databaseInitializer = async () => {
  return createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_HOST_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: getEntities(),
    synchronize: true,
  })
    .then(async connection => {
      console.log('Connection has been established successfully.')
    })
    .catch(error => console.log(error))
}
