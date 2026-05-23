import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, ChevronLeft, Zap, ArrowRight, Heart, X } from 'lucide-react'
import api from '../api/axios'
import useStore from '../store/useStore'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { getGuestCart, saveGuestCart } from '../utils/guestCart'
import toast from 'react-hot-toast'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, cartCount, setCartCount } = useStore()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [guestCartVersion, setGuestCartVersion] = useState(0)
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const queryClient = useQueryClient()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
  })

  const { data: related } = useQuery({
    queryKey: ['products-related'],
    queryFn: () => api.get('/products?limit=5').then(r => r.data),
    enabled: !!product,
  })

  const { data: cartData = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: !!user,
  })

  useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data),
    enabled: !!user,
    onSuccess: (data) => {
      if (product) setInWishlist(data.some(i => i.product_id === product.id))
    },
  })

  // inCart и cartItemId вычисляем без state
  const { inCart, cartItemId } = useMemo(() => {
    if (!product) return { inCart: false, cartItemId: null }
    if (user) {
      const item = cartData.find(i => i.product_id === product.id)
      return { inCart: !!item, cartItemId: item?.id || null }
    }
    void guestCartVersion
    const guestCart = getGuestCart()
    return {
      inCart: guestCart.some(i => i.product_id === product.id),
      cartItemId: null,
    }
  }, [user, cartData, product, guestCartVersion])

  // Добавить в корзину
  const addToCart = async () => {
    if (user) {
      try {
        await api.post('/cart', { product_id: product.id, quantity: qty })
        setCartCount(cartCount + qty)
        queryClient.invalidateQueries(['cart'])
      } catch {
        toast.error('Ошибка')
      }
    } else {
      const cart = getGuestCart()
      const existing = cart.find(i => i.product_id === product.id)
      if (existing) {
        existing.quantity += qty
      } else {
        cart.push({
          product_id: product.id,
          title: product.title,
          price: product.price,
          brand: product.brand,
          image: product.images?.[0] || '',
          quantity: qty,
        })
      }
      saveGuestCart(cart)
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0))
      window.dispatchEvent(new Event('guest-cart-updated'))
      setGuestCartVersion(v => v + 1)
    }
  }

  // Убрать из корзины
  const removeFromCart = async () => {
    if (user) {
      try {
        await api.delete(`/cart/${cartItemId}`)
        setCartCount(Math.max(0, cartCount - 1))
        queryClient.invalidateQueries(['cart'])
        toast('Убрано из корзины')
      } catch {
        toast.error('Ошибка')
      }
    } else {
      const newCart = getGuestCart().filter(i => i.product_id !== product.id)
      saveGuestCart(newCart)
      setCartCount(newCart.reduce((s, i) => s + i.quantity, 0))
      window.dispatchEvent(new Event('guest-cart-updated'))
      setGuestCartVersion(v => v + 1)
      toast('Убрано из корзины')
    }
  }

  // Купить сейчас
  const buyNow = () => {
    navigate('/checkout', {
      state: {
        buyNowItem: {
          product_id: product.id,
          title: product.title,
          price: product.price,
          brand: product.brand,
          image: product.images?.[0] || '',
          quantity: qty,
        }
      }
    })
  }

  // Избранное
  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Войдите, чтобы добавить в избранное')
      return
    }
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${product.id}`)
        setInWishlist(false)
        toast('Удалено из избранного')
      } else {
        await api.post('/wishlist', { product_id: product.id })
        setInWishlist(true)
        toast.success('Добавлено в избранное!')
      }
      queryClient.invalidateQueries(['wishlist'])
    } catch {
      toast.error('Ошибка')
    }
  }

  const submitReview = useMutation({
    mutationFn: () => api.post('/reviews', { product_id: product.id, ...reviewForm }),
    onSuccess: () => {
      toast.success('Отзыв добавлен на модерацию!')
      queryClient.invalidateQueries(['product', id])
      setReviewForm({ rating: 5, text: '' })
    },
    onError: () => toast.error('Ошибка при добавлении отзыва'),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (!product) {
    return <div className="text-center py-20">Товар не найден</div>
  }

  const images = product.images?.filter(Boolean) || []
  const relatedProducts = related?.products?.filter(p => p.id !== product.id).slice(0, 4) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link
        to="/catalog"
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft size={16} /> Назад в каталог
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

        {/* Галерея */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <img
              src={
                images[activeImg]
                  ? `http://localhost:5000${images[activeImg]}`
                  : 'https://placehold.co/600x600/faf8f5/c8a882?text=Kiki+Care'
              }
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={`http://localhost:5000${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация */}
        <div>
          <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
          <h1 className="font-heading text-3xl font-bold mb-3">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={Math.round(product.rating)} />
            <span className="text-sm text-gray-400">({product.reviews_count} отзывов)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{product.price} ₽</span>
            {product.old_price && (
              <span className="text-lg text-gray-400 line-through">{product.old_price} ₽</span>
            )}
          </div>

          {product.short_desc && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.short_desc}</p>
          )}

          {/* Количество */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg"
              >−</button>
              <span className="px-4 py-2 font-medium min-w-[40px] text-center">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg"
              >+</button>
            </div>
            <span className="text-sm text-gray-400">
              Итого: <span className="font-semibold text-dark">{product.price * qty} ₽</span>
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-3 mb-6">

            {/* Купить сейчас — всегда */}
            <button
              onClick={buyNow}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              <Zap size={18} />
              Купить сейчас
            </button>

            {/* Корзина + избранное */}
            <div className="flex gap-3">
              {inCart ? (
                // Товар в корзине — две кнопки рядом
                <>
                  <Link
                    to="/cart"
                    className="btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-base"
                  >
                    <ArrowRight size={18} />
                    Перейти в корзину
                  </Link>
                  <button
                    onClick={removeFromCart}
                    className="w-14 flex items-center justify-center border-2 border-gray-200 rounded-full text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    title="Убрать из корзины"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                // Товара нет в корзине
                <button
                  onClick={addToCart}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-base"
                >
                  <ShoppingBag size={18} />
                  В корзину
                </button>
              )}

              {/* Избранное */}
              <button
                onClick={toggleWishlist}
                className={`w-14 flex items-center justify-center border-2 rounded-full transition-colors ${
                  inWishlist
                    ? 'border-red-300 text-red-400 bg-red-50 hover:bg-red-100'
                    : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
                title={inWishlist ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {product.volume && (
            <p className="text-sm text-gray-400 mb-4">Объём: {product.volume}</p>
          )}

          {product.description && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.inci && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-2 text-sm">Состав (INCI)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{product.inci}</p>
            </div>
          )}

          {product.usage_guide && (
            <div className="p-4 bg-primary/5 rounded-xl">
              <h3 className="font-semibold mb-2 text-sm">Способ применения</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.usage_guide}</p>
            </div>
          )}
        </div>
      </div>

      {/* Отзывы */}
      <div className="mb-16">
        <h2 className="font-heading text-2xl font-bold mb-6">
          Отзывы ({product.reviews?.length || 0})
        </h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map(r => (
              <div key={r.id} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{r.user_name}</span>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(r.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mb-8">Пока нет отзывов. Будьте первым!</p>
        )}

        {user ? (
          <div className="card p-6 max-w-lg">
            <h3 className="font-semibold mb-4">Оставить отзыв</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Ваша оценка</label>
              <StarRating
                rating={reviewForm.rating}
                onRate={r => setReviewForm(f => ({ ...f, rating: r }))}
              />
            </div>
            <textarea
              className="input mb-3 resize-none"
              rows={4}
              placeholder="Ваш отзыв..."
              value={reviewForm.text}
              onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
            />
            <button
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending}
              className="btn-primary"
            >
              {submitReview.isPending ? 'Отправляем...' : 'Отправить отзыв'}
            </button>
          </div>
        ) : (
          <div className="card p-6 max-w-lg text-center">
            <p className="text-gray-500 mb-3">Чтобы оставить отзыв, войдите в аккаунт</p>
            <Link to="/login" className="btn-primary">Войти</Link>
          </div>
        )}
      </div>

      {/* Похожие товары */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">Вам может понравиться</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}