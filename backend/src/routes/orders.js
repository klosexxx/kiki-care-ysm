const router = require('express').Router()
const pool = require('../config/db')
const { authMiddleware } = require('../middleware/auth')
const https = require('https')

async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId || token === 'сюда_позже') return
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    req.write(body)
    req.end()
    req.on('response', resolve)
  })
}

// Создать заказ
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect()
  try {
    const { name, phone, email, address, comment, items, total } = req.body
    await client.query('BEGIN')
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, name, phone, email, address, comment, total) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.id, name, phone, email, address, comment, total]
    )
    const order = orderResult.rows[0]
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, title, price, quantity, image_url) VALUES ($1,$2,$3,$4,$5,$6)',
        [order.id, item.product_id, item.title, item.price, item.quantity, item.image]
      )
    }
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id])
    await client.query('COMMIT')

    const itemsList = items.map(i => `  • ${i.title} x${i.quantity} — ${i.price * i.quantity} ₽`).join('\n')
    await sendTelegram(`🛍️ <b>Новый заказ №${order.id}</b>\n👤 ${name}\n📞 ${phone}\n📍 ${address || 'не указан'}\n\n${itemsList}\n\n💰 <b>Итого: ${total} ₽</b>`)

    res.json({ success: true, order })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Ошибка при создании заказа' })
  } finally {
    client.release()
  }
})

// История заказов
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    )
    for (const order of orders.rows) {
      const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id])
      order.items = items.rows
    }
    res.json(orders.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router