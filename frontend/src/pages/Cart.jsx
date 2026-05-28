import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api/axios'
import useStore from '../store/useStore'
import { getGuestCart, saveGuestCart } from '../utils/guestCart'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function Cart() {
  const { user, setCartCount } = useStore()
  const queryClient = useQueryClient()
  const [wishlistIds, setWishlistIds] = useState([])

  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: !!user,
  })

  useEffect(() => {
    if (!user) return
    api.get('/wishlist')
      .then(r => setWishlistIds(r.data.map(i => i.product_id)))
      .catch(() => {})
  }, [user])

  const guestItems = user ? [] : getGuestCart()
  const items = user ? dbItems : guestItems
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQty = useMutation({
    mutationFn: ({ id, quantity }) => api.put(`/cart/${id}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries(['cart']),
  })

  const removeItem = useMutation({
    mutationFn: (id) => api.delete(`/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart'])
      toast('Товар удалён')
    },
  })

  const handleGuestQty = (productId, delta) => {
    const cart = getGuestCart()
    const item = cart.find(i => i.product_id === productId)
    if (!item) return
    item.quantity += delta
    const newCart = item.quantity <= 0
      ? cart.filter(i => i.product_id !== productId)
      : cart
    saveGuestCart(newCart)
    setCartCount(newCart.reduce((s, i) => s + i.quantity, 0))
    window.dispatchEvent(new Event('guest-cart-updated'))
  }

  const handleGuestRemove = (productId) => {
    const newCart = getGuestCart().filter(i => i.product_id !== productId)
    saveGuestCart(newCart)
    setCartCount(newCart.reduce((s, i) => s + i.quantity, 0))
    window.dispatchEvent(new Event('guest-cart-updated'))
    toast('Товар удалён')
  }

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Войдите, чтобы добавить в избранное')
      return
    }
    const isIn = wishlistIds.includes(productId)
    try {
      if (isIn) {
        await api.delete(`/wishlist/${productId}`)
        setWishlistIds(prev => prev.filter(id => id !== productId))
        toast('Удалено из избранного')
      } else {
        await api.post('/wishlist', { product_id: productId })
        setWishlistIds(prev => [...prev, productId])
        toast.success('Добавлено в избранное!')
      }
      queryClient.invalidateQueries(['wishlist'])
    } catch {
      toast.error('Ошибка')
    }
  }

  if (user && isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <p className="text-gray-400 mb-2">Корзина пуста</p>
        <p className="text-sm text-gray-300 mb-6">Добавьте товары из каталога</p>
        <Link to="/catalog" className="btn-primary">В каталог</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Корзина</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => {
            const key = user ? item.id : item.product_id
            const productId = item.product_id
            const imgSrc = item.image
              ? `${API_BASE}${item.image}`
              : 'https://placehold.co/100x100/faf8f5/c8a882?text=KC'
            const isInWishlist = wishlistIds.includes(productId)

            return (
              <div key={key} className="card p-4 flex gap-4">

                <Link to={`/product/${productId}`} className="shrink-0">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl hover:opacity-80 transition-opacity"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">{item.brand}</p>
                  <Link
                    to={`/product/${productId}`}
                    className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2 block mb-2"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden text-sm">
                      <button
                        onClick={() => user
                          ? updateQty.mutate({ id: item.id, quantity: item.quantity - 1 })
                          : handleGuestQty(productId, -1)
                        }
                        className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      >−</button>
                      <span className="px-3 py-1 min-w-[32px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => user
                          ? updateQty.mutate({ id: item.id, quantity: item.quantity + 1 })
                          : handleGuestQty(productId, 1)
                        }
                        className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      >+</button>
                    </div>
                    <span className="font-semibold text-primary">
                      {item.price * item.quantity} ₽
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleWishlist(productId)}
                    className={`p-2 rounded-full transition-colors ${
                      isInWishlist
                        ? 'text-red-400 hover:bg-red-50'
                        : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
                    }`}
                    title={isInWishlist ? 'Убрать из избранного' : 'В избранное'}
                  >
                    <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={() => user
                      ? removeItem.mutate(item.id)
                      : handleGuestRemove(productId)
                    }
                    className="p-2 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Итого</h3>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-500">
              Товары ({items.reduce((s, i) => s + i.quantity, 0)} шт.)
            </span>
            <span>{total} ₽</span>
          </div>
          <div className="flex justify-between mb-6 text-sm">
            <span className="text-gray-500">Доставка</span>
            <span className="text-green-500">Бесплатно</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4 mb-6">
            <span>К оплате</span>
            <span className="text-primary">{total} ₽</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full block text-center">
            Оформить заказ
          </Link>
          <Link
            to="/catalog"
            className="block text-center text-sm text-gray-400 hover:text-dark transition-colors mt-4"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  )
}