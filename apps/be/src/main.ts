import cors from 'cors'
import express from 'express'
import { initMongo } from './datasources/mongo'
import { initPg } from './datasources/pg'

Promise.all([initPg(), initMongo()]).then(([pg, mongo]) =>
  express()
    .use(cors())
    /** Playwright requires a the index route `/` to be present in order the webServer to start correctly, otherwise it will timeout when running the tests. */
    .get('/', (_, res) => res.send('OK'))
    .get('/health', (_, res) => res.send({ status: 'ok' }))
    .get('/users', async (_, res) => res.send({ users: (await pg.query('SELECT * FROM users')).rows }))
    .get('/todos', async (_, res) => res.send({ todos: await mongo.todos.find().toArray() }))
    .listen(4000, () => console.log('Server running at http://localhost:4000/'))
)
