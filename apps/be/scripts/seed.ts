import { seedDatabase } from '../src/datasources/utils'

seedDatabase()
  .catch(console.error)
  .finally(() => process.exit())
