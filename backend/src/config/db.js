const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
})

pool.on('error', (err) => {
  console.error('Неожиданная ошибка пула БД:', err.message)
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к БД:', err.message)
  } else {
    console.log('✅ PostgreSQL подключён')
    release()
  }
})

module.exports = pool