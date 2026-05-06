const router = require('express').Router()
const pool = require('../config/db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name')
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router