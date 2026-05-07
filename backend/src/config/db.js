const { Pool } = require('pg')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: false,
      }
)

pool.on('error', (err) => {
  console.error('Ошибка пула БД:', err.message)
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