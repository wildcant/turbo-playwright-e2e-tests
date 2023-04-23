import { initPg } from '../src/datasources/pg'

async function migratePg() {
  const pg = await initPg()
  await pg.deleteTables()
  await pg.createUsersTable()
  console.log('postgres database migrated')
}

migratePg().catch(console.error).finally(process.exit)
