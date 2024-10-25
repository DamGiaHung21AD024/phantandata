import 'dotenv/config'

import { Connection } from 'typeorm'

import { connectToDb } from './dbconfig'

let connection: Connection
const runMigrations = async () => {
  if (!connection) {
    connection = await connectToDb()
  }

  await connection.runMigrations({
    transaction: 'all'
  })
}

runMigrations()
