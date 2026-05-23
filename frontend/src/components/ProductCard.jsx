import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import api from '../api/axios'
import useStore from '../store/useStore'
import { getGuestCart, saveGuestCart } from '../utils/guestCart'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { user, setCartCount, cartCount } = useStore()
  const [wished, setWished] = useState(false)
  const image = product.main_image || product.images?.[0] || '/placeholder.jpg'

  const addToCart = async (e) => {
    e.preventDefault()
    if (user) {
      try {
        await api.post('/cart', { product_id: product.id, quantity: 1 })
        setCartCount(cartCount + 1)
        toast.success('Добавлено в корзину!')
      } catch {
        toast.error('Ошибка')
      }
    } else {
      const cart = getGuestCart()
      const existing = cart.find(i => i.product_id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        cart.push({
          product_id: product.id,
          title: product.title,
          price: product.price,
          brand: product.brand,
          image: product.main_image || product.images?.[0] || '',
          quantity: 1,
        })
      }
      saveGuestCart(cart)
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0))
      toast.success('Добавлено в корзину!')
    }
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Войдите чтобы добавить в избранное')
      return
    }
    try {
      if (wished) {
        await api.delete(`/wishlist/${product.id}`)
        setWished(false)
        toast('Удалено из избранного')
      } else {
        await api.post('/wishlist', { product_id: product.id })
        setWished(true)
        toast.success('Добавлено в избранное!')
      }
    } catch {
      toast.error('Ошибка')
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="block group h-full">
      <div className="flex flex-col h-full">

        {/* Фото */}
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#f5f0eb] shrink-0">
          <img
            src={`http://localhost:5000${image}`}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x500/faf8f5/c8a882?text=Kiki+Care'
            }}
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
              −{Math.round((1 - product.price / product.old_price) * 100)}%
            </span>
          )}

          {/* Кнопка корзины — только на десктопе выезжает при наведении */}
          <button
            onClick={addToCart}
            className="
              absolute bottom-0 left-0 right-0
              bg-dark/90 backdrop-blur-sm text-white
              text-[11px] tracking-[0.15em] uppercase
              py-3 items-center justify-center gap-2
              transition-transform duration-300
              hidden md:flex md:translate-y-full md:group-hover:translate-y-0
            "
          >
            <ShoppingBag size={13} />
            В корзину
          </button>
        </div>

        {/* Текст — растягивается чтобы выровнять карточки */}
        <div className="pt-3 px-1 flex flex-col flex-1">

          {/* Бренд */}
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1.5 shrink-0">
            {product.brand}
          </p>

          {/* Название — занимает доступное место */}
          <h3 className="font-heading text-[17px] font-semibold leading-snug text-dark group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 flex-1">
            {product.title}
          </h3>

          {/* Рейтинг */}
          <div className="flex items-center gap-1.5 mb-3 shrink-0">
            <Star size={11} className="text-primary fill-primary shrink-0" />
            <span className="text-xs text-gray-500 font-medium">
              {Number(product.rating).toFixed(1)}
            </span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">
              {product.reviews_count} отзывов
            </span>
          </div>

          {/* Цена + кнопка корзины на мобильном */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-bold text-dark">
                {product.price} ₽
              </span>
              {product.old_price && (
                <span className="text-xs text-gray-400 line-through">
                  {product.old_price} ₽
                </span>
              )}
            </div>

            {/* Только мобильные — единственная кнопка корзины */}
            <button
              onClick={addToCart}
              className="md:hidden p-2.5 bg-dark text-white rounded-full active:scale-95 transition-transform shrink-0"
              aria-label="Добавить в корзину"
            >
              <ShoppingBag size={15} />
            </button>
          </div>

        </div>
      </div>
    </Link>
  )
}