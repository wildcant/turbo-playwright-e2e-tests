import { env } from '../env'
import { MongoClient } from 'mongodb'

type MongoTodo = {
  title: string
  completed: boolean
}

export async function initMongo() {
  const client = new MongoClient(env.MONGO_URL)
  const database = client.db('test')
  await client.db('admin').command({ ping: 1 })

  return {
    database,
    todos: database.collection<MongoTodo>('reservations'),
  }
}

export type Mongo = Awaited<ReturnType<typeof initMongo>>
