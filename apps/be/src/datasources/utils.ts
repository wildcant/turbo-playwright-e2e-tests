import { seedMongo } from './mongo'
import { seedPg } from './pg'

export const seedDatabase = async () => Promise.all([seedPg(), seedMongo()])
