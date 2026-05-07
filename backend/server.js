require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))

app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/products', require('./src/routes/products'))
app.use('/api/categories', require('./src/routes/categories'))
app.use('/api/cart', require('./src/routes/cart'))
app.use('/api/wishlist', require('./src/routes/wishlist'))
app.use('/api/reviews', require('./src/routes/reviews'))
app.use('/api/orders', require('./src/routes/orders'))
app.use('/api/admin', require('./src/routes/admin'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`))