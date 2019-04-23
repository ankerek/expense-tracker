import { createConnection } from 'typeorm'
import { getEntities } from '../databaseInitializer'
import dotenv from 'dotenv'

dotenv.config()

export const testConnection = (drop = false) => {
  return createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_HOST_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    dropSchema: drop,
    entities: getEntities(),
  })
}
