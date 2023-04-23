import { User, UserSchema, seed } from 'schemas'
import { Client } from 'pg'
import { OptionalId } from 'schemas'
import { z } from 'zod'
import { env } from '../env'

const tables = z.enum(['users'])

type Table = z.infer<typeof tables>

const config = {
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_NAME,
  password: env.PG_PASSWORD,
  port: env.PG_PORT,
}

const client = new Client(config)

export async function initPg() {
  await client.connect()
  return {
    client,

    tableExist: async (table: Table) =>
      (
        await client.query(`
          SELECT CASE WHEN EXISTS 
            (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'public' AND TABLE_NAME = '${table}')
            THEN
              CAST(1 AS BIT) 
            ELSE
              CAST(0 AS BIT)
            END;
        `)
      ).rows[0].case === '1',

    insertUsers: async (data: Array<OptionalId<User>>) => {
      const table: Table = 'users'

      const properties = Object.keys(UserSchema.omit({ id: true }).keyof().Values).join(', ')

      let valuesPlaceholders = ''
      data.forEach((_, idx) => {
        valuesPlaceholders += `($${5 * idx + 1}, $${5 * idx + 2}, $${5 * idx + 3}, $${5 * idx + 4}, $${
          5 * idx + 5
        })${idx !== data.length - 1 ? ', ' : ''}`
      })

      const values = data.map((user) => Object.keys(user).map((key) => user[key as keyof typeof user])).flat()

      return client.query({
        text: `INSERT INTO ${table} (${properties}) VALUES ${valuesPlaceholders}`,
        values,
      })
    },

    deleteTables: async () =>
      client.query(`
        DO $$ DECLARE 
          r RECORD;
          BEGIN FOR r IN (
                  SELECT tablename
                  FROM pg_tables
                  WHERE
                      schemaname = 'public'
              ) LOOP
          EXECUTE
              'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
          END 
        $$;
      `),

    createUsersTable: async () =>
      client.query(`
        CREATE TABLE users(  
          id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          name VARCHAR(255),
          username VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(255),
          website VARCHAR(255),
          create_at DATE DEFAULT CURRENT_DATE
        );
      `),
  }
}

export async function seedPg() {
  const pg = await initPg()
  if (!(await pg.tableExist('users'))) {
    await pg.createUsersTable()
  }
  await pg.insertUsers(seed.users)
  console.log('Added users to postgres')
}
