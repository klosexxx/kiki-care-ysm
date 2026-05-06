const router = require('express').Router()
const pool = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.id, p.id as product_id, p.title, p.price, p.brand,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_main = true LIMIT 1) as image
      FROM wishlist w JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
    `, [req.user.id])
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id } = req.body
    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, product_id]
    )
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.id, req.params.productId])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router