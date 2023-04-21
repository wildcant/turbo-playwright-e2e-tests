import { initMongo } from '../../src/datasources/mongo'
import { initPg } from '../../src/datasources/pg'
import todos from './data/todos.json'
import users from './data/users.json'

async function seedMongo() {
  const mongo = await initMongo()
  await mongo.todos.insertMany(todos)
  console.log('Added todos to mongo db')
}

async function seedPg() {
  let valuesPlaceholders = ''
  users.forEach((_, idx) => {
    valuesPlaceholders += `($${5 * idx + 1}, $${5 * idx + 2}, $${5 * idx + 3}, $${5 * idx + 4}, $${
      5 * idx + 5
    })${idx !== users.length - 1 ? ', ' : ''}`
  })

  const values = users.map((user) => Object.keys(user).map((key) => user[key as keyof typeof user])).flat()

  const query = {
    text: `INSERT INTO users ( name, username, email, phone, website ) VALUES ${valuesPlaceholders}`,
    values: values,
  }

  const client = await initPg()

  await client.query(query)
  console.log('Added users to postgres')
}

async function seed() {
  await Promise.all([seedPg(), seedMongo()])
  return
}

seed().finally(() => process.exit())
