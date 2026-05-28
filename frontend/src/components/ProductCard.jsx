import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import useStore from '../store/useStore'
import { getGuestCart, saveGuestCart } from '../utils/guestCart'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function ProductCard({ product }) {
  const { user, setCartCount, cartCount } = useStore()
  const [wished, setWished] = useState(false)
  const [inCart, setInCart] = useState(() => {
    if (user) return false
    const cart = getGuestCart()
    return !!cart.find(i => i.product_id === product.id)
  })

  // Минимальный рейтинг 4.7
  const rating = Math.max(4.7, Number(product.rating))

  useEffect(() => {
    const handler = () => {
      if (!user) {
        const cart = getGuestCart()
        setInCart(!!cart.find(i => i.product_id === product.id))
      }
    }
    window.addEventListener('guest-cart-updated', handler)
    return () => window.removeEventListener('guest-cart-updated', handler)
  }, [user, product.id])

  // Разделяем "Серия — Описание" на две части
  const dashIdx = product.title.indexOf(' — ')
  let seriesLabel = null
  let mainTitle = product.title
  if (dashIdx !== -1) {
    const before = product.title.substring(0, dashIdx)
    const after  = product.title.substring(dashIdx + 3)
    if (after.length >= 15) {
      seriesLabel = before
      mainTitle   = after
    }
  }

  const image = product.main_image || product.images?.[0] || ''

  const addToCart = async (e) => {
    e.preventDefault()
    if (inCart) return
    if (user) {
      try {
        await api.post('/cart', { product_id: product.id, quantity: 1 })
        setCartCount(cartCount + 1)
        setInCart(true)
      } catch {
        toast.error('Ошибка')
        return
      }
    } else {
      const cart = getGuestCart()
      const existing = cart.find(i => i.product_id === product.id)
      if (existing) existing.quantity += 1
      else cart.push({
        product_id: product.id,
        title: product.title,
        price: product.price,
        brand: product.brand,
        image: product.main_image || product.images?.[0] || '',
        quantity: 1,
      })
      saveGuestCart(cart)
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0))
      window.dispatchEvent(new Event('guest-cart-updated'))
      setInCart(true)
    }
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Войдите чтобы добавить в избранное'); return }
    try {
      if (wished) {
        await api.delete(`/wishlist/${product.id}`)
        setWished(false)
      } else {
        await api.post('/wishlist', { product_id: product.id })
        setWished(true)
      }
    } catch { toast.error('Ошибка') }
  }

  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="flex flex-col h-full">

        {/* Фото */}
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#f5f0eb] shrink-0">
          <img
            src={image ? `${API_BASE}${image}` : null}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.target.src = 'https://placehold.co/400x500/faf8f5/c8a882?text=Kiki+Care' }}
          />

          {/* Избранное */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
              wished ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart size={14} fill={wished ? 'currentColor' : 'none'} />
          </button>

          {/* Скидка */}
          {product.old_price && (
            <span className="absolute top-3 left-3 bg-dark text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium">
              -{Math.round((1 - product.price / product.old_price) * 100)}%
            </span>
          )}

          {/* Кнопка корзины — десктоп */}
          <button
            onClick={addToCart}
            className={`
              absolute bottom-0 left-0 right-0
              backdrop-blur-sm text-white
              text-[11px] tracking-[0.15em] uppercase
              py-3 items-center justify-center gap-2
              transition-all duration-300
              hidden md:flex md:translate-y-full md:group-hover:translate-y-0
              ${inCart ? 'bg-primary/90' : 'bg-dark/90 hover:bg-dark'}
            `}
          >
            {inCart
              ? <><Check size={13} /> В корзине</>
              : <><ShoppingBag size={13} /> В корзину</>
            }
          </button>
        </div>

        {/* Текст */}
        <div className="pt-3 px-0.5 flex flex-col flex-1">

          {/* Бренд */}
          <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1 shrink-0 font-medium">
            {product.brand}
          </p>

          {/* Серия */}
          {seriesLabel && (
            <p className="text-[11px] text-gray-400 mb-1.5 shrink-0 leading-tight italic">
              {seriesLabel}
            </p>
          )}

          {/* Главное название */}
          <h3
            className="text-[15px] md:text-[16px] leading-snug text-dark group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2.5 flex-1"
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            {mainTitle}
          </h3>

          {/* Рейтинг */}
          <div className="flex items-center gap-1.5 mb-3 shrink-0">
            <span className="text-primary text-xs">★</span>
            <span className="text-xs text-gray-600 font-semibold">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{product.reviews_count} отзывов</span>
          </div>

          {/* Цена + кнопка мобильная */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold text-dark tracking-tight">
                {Number(product.price).toLocaleString('ru-RU')} ₽
              </span>
              {product.old_price && (
                <span className="text-xs text-gray-400 line-through">
                  {Number(product.old_price).toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>

            <button
              onClick={addToCart}
              className={`md:hidden p-2.5 rounded-full active:scale-95 transition-all shrink-0 ${
                inCart ? 'bg-primary text-white' : 'bg-dark text-white'
              }`}
              aria-label="Добавить в корзину"
            >
              {inCart ? <Check size={15} /> : <ShoppingBag size={15} />}
            </button>
          </div>

        </div>
      </div>
    </Link>
  )
}