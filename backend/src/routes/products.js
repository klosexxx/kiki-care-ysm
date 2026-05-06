const router = require('express').Router()
const pool = require('../config/db')

// Каталог с фильтрами, поиском, пагинацией
router.get('/', async (req, res) => {
  try {
    const {
      category, brand, skin, minPrice, maxPrice,
      search, sort, page = 1, limit = 12
    } = req.query

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = ['p.is_active = true']
    const values = []
    let i = 1

    if (category) { conditions.push(`c.slug = $${i++}`); values.push(category) }
    if (brand) { conditions.push(`p.brand = $${i++}`); values.push(brand) }
    if (skin) { conditions.push(`$${i++} = ANY(p.skin_types)`); values.push(skin) }
    if (minPrice) { conditions.push(`p.price >= $${i++}`); values.push(Number(minPrice)) }
    if (maxPrice) { conditions.push(`p.price <= $${i++}`); values.push(Number(maxPrice)) }
    if (search) {
      conditions.push(`(p.title ILIKE $${i} OR p.brand ILIKE $${i})`)
      i++
      values.push(`%${search}%`)
    }

    const where = conditions.join(' AND ')

    let orderBy = 'p.created_at DESC'
    if (sort === 'price-asc') orderBy = 'p.price ASC'
    if (sort === 'price-desc') orderBy = 'p.price DESC'
    if (sort === 'rating') orderBy = 'p.rating DESC'
    if (sort === 'name') orderBy = 'p.title ASC'

    const countQuery = `
      SELECT COUNT(*) FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where}
    `
    const countResult = await pool.query(countQuery, values)
    const total = parseInt(countResult.rows[0].count)

    const dataQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_main = true LIMIT 1) as main_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where}
      ORDER BY ${orderBy}
      LIMIT $${i++} OFFSET $${i++}
    `
    values.push(parseInt(limit), offset)

    const result = await pool.query(dataQuery, values)

    res.json({
      products: result.rows,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Карточка товара
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await pool.query(`
      SELECT p.*, c.name as category_name,
        array_agg(pi.url ORDER BY pi.sort_order) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [id])

    if (product.rows.length === 0) return res.status(404).json({ error: 'Товар не найден' })

    const reviews = await pool.query(`
  SELECT r.*, u.name as user_name
  FROM reviews r JOIN users u ON r.user_id = u.id
  WHERE r.product_id = $1 AND r.is_approved = TRUE
  ORDER BY r.created_at DESC
`, [id])

    res.json({ ...product.rows[0], reviews: reviews.rows })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

module.exports = router