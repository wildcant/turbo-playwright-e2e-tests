import dotenv from 'dotenv'
import z from 'zod'

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

const envVariables = z.object({
  PG_USER: z.string(),
  PG_HOST: z.string(),
  PG_PASSWORD: z.string(),
  PG_PORT: z.coerce.number(),
  PG_NAME: z.string(),
  MONGO_URL: z.string(),
  API_PORT: z.coerce.number(),
})

export const env = envVariables.parse(process.env)
