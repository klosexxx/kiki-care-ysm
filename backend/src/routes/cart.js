const router = require('express').Router()
const pool = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

// Получить корзину
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.title, p.price, p.brand,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_main = true LIMIT 1) as image
      FROM cart c JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [req.user.id])
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Добавить в корзину
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body
    await pool.query(`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart.quantity + $3
    `, [req.user.id, product_id, quantity])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Изменить количество
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body
    if (quantity < 1) {
      await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    } else {
      await pool.query('UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3', [quantity, req.params.id, req.user.id])
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Удалить из корзины
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Очистить корзину
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router