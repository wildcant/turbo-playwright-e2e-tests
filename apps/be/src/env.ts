import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envVariables = z.object({
  PG_USER: z.string(),
  PG_HOST: z.string(),
  PG_PASSWORD: z.string(),
  PG_PORT: z.coerce.number(),
  PG_NAME: z.string(),
  MONGO_URL: z.string(),
  API_SECRET: z.string(),
})

export const env = envVariables.parse(process.env)
