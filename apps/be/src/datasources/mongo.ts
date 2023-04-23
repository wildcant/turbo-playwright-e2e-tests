import { MongoClient } from 'mongodb'
import { Todo, seed } from 'schemas'
import { env } from 'env'
import { OptionalObjectId } from 'schemas'

export async function initMongo() {
  const client = new MongoClient(env.MONGO_URL)
  const database = client.db('test')
  await client.db('admin').command({ ping: 1 })

  return {
    database,
    todos: database.collection<OptionalObjectId<Todo>>('todos'),
  }
}

export type Mongo = Awaited<ReturnType<typeof initMongo>>

export async function seedMongo() {
  const mongo = await initMongo()
  await mongo.todos.insertMany(seed.todos)
  console.log('Added todos to mongo db')
}
