import { Client } from 'pg'
import { env } from '../env'

const client = new Client({
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_NAME,
  password: env.PG_PASSWORD,
  port: env.PG_PORT,
})

export async function initPg() {
  await client.connect()
  return client
}
