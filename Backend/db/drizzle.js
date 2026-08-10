const { drizzle } = require('drizzle-orm/better-sqlite3')
const db = require('../db')
const schema = require('./schema')

const client = drizzle(db, { schema })

module.exports = client
