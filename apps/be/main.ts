import express from 'express'
import cors from 'cors'

express()
  .use(cors())
  .use('/', (_, res) => res.send({ msg: 'Hello there' }))
  .listen(4000, () => console.log('Server running at http://localhost:4000/'))
