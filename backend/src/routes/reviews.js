const router = require('express').Router()
const pool = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { product_id, rating, text } = req.body
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Рейтинг от 1 до 5' })
    }
    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: 'Напишите отзыв (минимум 5 символов)' })
    }
    const clean = text.replace(/[<>&"']/g, c =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c])
    )
    await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, text, is_approved)
       VALUES ($1, $2, $3, $4, FALSE)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET rating = $3, text = $4, is_approved = FALSE`,
      [req.user.id, product_id, rating, clean]
    )
    res.json({ success: true, message: 'Отзыв отправлен на модерацию' })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router