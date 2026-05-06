import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import api from '../api/axios'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { user, setCartCount, cartCount } = useStore()
  const [wished, setWished] = useState(false)
  const image = product.main_image || product.images?.[0] || '/placeholder.jpg'

  const addToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Войдите чтобы добавить в корзину'); return }
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 })
      setCartCount(cartCount + 1)
      toast.success('Добавлено в корзину!')
    } catch {
      toast.error('Ошибка')
    }
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Войдите чтобы добавить в избранное'); return }
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
    <Link to={`/product/${product.id}`} className="card block group">
      <div className="relative overflow-hidden rounded-t-2xl aspect-square bg-gray-50">
        <img
          src={`http://localhost:5000${image}`}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/400x400/faf8f5/c8a882?text=Kiki+Care' }}
        />
        <button onClick={toggleWishlist} className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow transition-colors ${wished ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
        {product.old_price && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.old_price) * 100)}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
        <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star size={12} className="text-primary fill-primary" />
          <span className="text-xs text-gray-500">{Number(product.rating).toFixed(1)} ({product.reviews_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-primary">{product.price} ₽</span>
            {product.old_price && <span className="text-xs text-gray-400 line-through ml-2">{product.old_price} ₽</span>}
          </div>
          <button onClick={addToCart} className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </Link>
  )
}