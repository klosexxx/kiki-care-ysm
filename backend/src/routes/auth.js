const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

// Регистрация
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, phone } = req.body

    // Базовая санитизация
    name = String(name || '').replace(/[<>&"'\/]/g, '').trim()
    email = String(email || '').trim().toLowerCase()
    phone = phone ? String(phone).replace(/[^\d+\-\s()]/g, '').trim() : null

    if (!name || name.length < 2) return res.status(400).json({ error: 'Некорректное имя' })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Некорректный email' })
    if (!password || password.length < 6) return res.status(400).json({ error: 'Пароль минимум 6 символов' })

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (exists.rows.length > 0) return res.status(400).json({ error: 'Email уже зарегистрирован' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, phone]
    )
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' })
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }
    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Получить текущего пользователя
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Нет токена' })
    const token = authHeader.split(' ')[1]
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
    const result = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [decoded.id])
    res.json(result.rows[0])
  } catch {
    res.status(401).json({ error: 'Токен недействителен' })
  }
})

module.exports = router