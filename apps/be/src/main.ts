import { TodoSchema, UserSchema } from 'schemas'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import z from 'zod'
import { initMongo } from './datasources/mongo'
import { initPg } from './datasources/pg'
import { seedDatabase } from './datasources/utils'
import { env } from './env'

async function bootstrap() {
  const [pg, mongo] = await Promise.all([initPg(), initMongo()])

  const app = express()

  app
    .use(cors())
    .use(bodyParser.json())
    /** Playwright requires a the index route `/` to be present in order the webServer to start correctly, otherwise it will timeout when running the tests. */
    .get('/', (_, res) => res.send('OK'))
    .get('/health', (_, res) => res.send({ status: 'ok' }))
    .get('/users', async (_, res) => res.send({ users: (await pg.client.query('SELECT * FROM users')).rows }))
    .get('/todos', async (_, res) => res.send({ todos: await mongo.todos.find().toArray() }))

  if (
    process.env.NODE_ENV === 'test' &&
    env.MONGO_URL === 'mongodb://127.0.0.1:27019/test' &&
    env.PG_HOST === 'localhost'
  ) {
    app.post('/database/seed', (_, res) => {
      seedDatabase()
      res.sendStatus(200)
    })

    app.get('/database/:entity', async (req, res) => {
      const tables = z.enum(['users'])
      if (tables.safeParse(req.params.entity).success) {
        const entity = tables.parse(req.params.entity)
        res.status(200)
        const response = await pg.client.query(`SELECT * FROM ${entity};`)
        return res.json({ results: response.rows })
      }

      const collections = z.enum(['todos'])
      if (collections.safeParse(req.params.entity).success) {
        const entity = collections.parse(req.params.entity)
        res.status(200)
        const results = await mongo[entity].find().toArray()
        return res.json({ results })
      }

      res.status(404)
      res.send()
    })

    app.post('/database/:entity', async (req, res) => {
      const tables = z.enum(['users'])
      if (tables.safeParse(req.params.entity).success) {
        const data = UserSchema.omit({ id: true }).array().parse(req.body)
        res.status(200)
        const response = await pg.insertUsers(data)
        return res.json({ response })
      }

      const collections = z.enum(['todos'])
      if (collections.safeParse(req.params.entity).success) {
        const entity = collections.parse(req.params.entity)
        const data = TodoSchema.omit({ _id: true }).array().parse(req.body)
        res.status(200)
        const response = await mongo[entity].insertMany(data)
        return res.json({ response })
      }

      res.status(404)
      res.send()
    })

    app.delete('/databases/reset', async (_, res) => {
      try {
        await Promise.all([pg.client.query(`DELETE FROM users;`), mongo.todos.deleteMany({})])

        res.status(200)
        res.json({ succeed: true })
      } catch (error) {
        res.status(400)
        res.json({ succeed: false })
      }
    })
  }

  await app.listen(env.API_PORT)

  console.log(`Server running at http://localhost:${env.API_PORT}`)
}

bootstrap()
