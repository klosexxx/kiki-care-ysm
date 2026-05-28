const router = require('express').Router()
const pool = require('../config/db')
const multer = require('multer')
const path = require('path')
const { adminMiddleware } = require('../middleware/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// Все заказы
router.get('/orders', adminMiddleware, async (req, res) => {
  try {
    const orders = await pool.query('SELECT o.*, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC')
    for (const order of orders.rows) {
      const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id])
      order.items = items.rows
    }
    res.json(orders.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Сменить статус заказа
router.put('/orders/:id', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Добавить товар
router.post('/products', adminMiddleware, upload.array('images', 5), async (req, res) => {
  const client = await pool.connect()
  try {
    const { title, brand, price, old_price, short_desc, description, inci, usage_guide, volume, skin_types, category_id, stock } = req.body
    await client.query('BEGIN')
    const result = await client.query(
      'INSERT INTO products (title, brand, price, old_price, short_desc, description, inci, usage_guide, volume, skin_types, category_id, stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',
      [title, brand, price, old_price || null, short_desc, description, inci, usage_guide, volume, JSON.parse(skin_types || '[]'), category_id, stock || 0]
    )
    const productId = result.rows[0].id
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_id, url, is_main, sort_order) VALUES ($1,$2,$3,$4)',
          [productId, `/uploads/${req.files[i].filename}`, i === 0, i]
        )
      }
    }
    await client.query('COMMIT')
    res.json({ success: true, id: productId })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Ошибка сервера' })
  } finally {
    client.release()
  }
})

// Редактировать товар
router.put('/products/:id', adminMiddleware, upload.array('images', 5), async (req, res) => {
  const client = await pool.connect()
  try {
    const {
      title, brand, price, old_price, short_desc, description,
      inci, usage_guide, volume, skin_types, category_id, stock, is_active
    } = req.body

    await client.query('BEGIN')

    await client.query(
      `UPDATE products SET
        title=$1, brand=$2, price=$3, old_price=$4, short_desc=$5,
        description=$6, inci=$7, usage_guide=$8, volume=$9,
        skin_types=$10, category_id=$11, stock=$12, is_active=$13
       WHERE id=$14`,
      [
        title, brand, price, old_price || null, short_desc,
        description, inci, usage_guide, volume,
        JSON.parse(skin_types || '[]'), category_id, stock, is_active,
        req.params.id
      ]
    )

    // Если загружены новые фото — заменяем старые
    if (req.files && req.files.length > 0) {
      await client.query('DELETE FROM product_images WHERE product_id = $1', [req.params.id])
      for (let i = 0; i < req.files.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_id, url, is_main, sort_order) VALUES ($1,$2,$3,$4)',
          [req.params.id, `/uploads/${req.files[i].filename}`, i === 0, i]
        )
      }
    }

    await client.query('COMMIT')
    res.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('PUT /products/:id error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  } finally {
    client.release()
  }
})

// Удалить товар
router.delete('/products/:id', adminMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE products SET is_active = false WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Все пользователи
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC')
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.get('/reviews', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name, p.title as product_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE r.is_approved = FALSE
      ORDER BY r.created_at DESC
    `)
    res.json(result.rows)
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.put('/reviews/:id/approve', adminMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET is_approved = TRUE WHERE id = $1', [req.params.id])
    const review = await pool.query('SELECT product_id FROM reviews WHERE id = $1', [req.params.id])
    if (review.rows.length > 0) {
      await pool.query(`
        UPDATE products SET
          rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = $1 AND is_approved = TRUE),
          reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1 AND is_approved = TRUE)
        WHERE id = $1
      `, [review.rows[0].product_id])
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/reviews/:id', adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router