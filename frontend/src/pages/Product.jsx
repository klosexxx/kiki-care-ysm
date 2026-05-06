import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, ChevronLeft } from 'lucide-react'
import api from '../api/axios'
import useStore from '../store/useStore'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function Product() {
  const { id } = useParams()
  const { user, cartCount, setCartCount } = useStore()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const queryClient = useQueryClient()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
  })

  const { data: related } = useQuery({
    queryKey: ['products-related'],
    queryFn: () => api.get('/products?limit=4').then(r => r.data),
    enabled: !!product,
  })

  const addToCart = async () => {
    if (!user) { toast.error('Войдите чтобы добавить в корзину'); return }
    await api.post('/cart', { product_id: product.id, quantity: qty })
    setCartCount(cartCount + qty)
    toast.success('Добавлено в корзину!')
  }

  const submitReview = useMutation({
    mutationFn: () => api.post('/reviews', { product_id: product.id, ...reviewForm }),
    onSuccess: () => {
      toast.success('Отзыв добавлен!')
      queryClient.invalidateQueries(['product', id])
      setReviewForm({ rating: 5, text: '' })
    },
    onError: () => toast.error('Ошибка при добавлении отзыва'),
  })

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse"><div className="h-96 bg-gray-100 rounded-2xl" /></div>
  if (!product) return <div className="text-center py-20">Товар не найден</div>

  const images = product.images?.filter(Boolean) || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link to="/catalog" className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary mb-8">
        <ChevronLeft size={16} /> Назад в каталог
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Галерея */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <img
              src={images[activeImg] ? `http://localhost:5000${images[activeImg]}` : 'https://placehold.co/600x600/faf8f5/c8a882?text=Kiki+Care'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary' : 'border-transparent'}`}>
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
            {product.old_price && <span className="text-lg text-gray-400 line-through">{product.old_price} ₽</span>}
          </div>
          <p className="text-gray-600 mb-6">{product.short_desc}</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50">−</button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-gray-50">+</button>
            </div>
            <button onClick={addToCart} className="btn-primary flex-1">
              <ShoppingBag size={18} /> В корзину
            </button>
          </div>

          {product.volume && <p className="text-sm text-gray-400 mb-4">Объём: {product.volume}</p>}

          {product.description && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
          )}
          {product.inci && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-2 text-sm">Состав (INCI)</h3>
              <p className="text-xs text-gray-500">{product.inci}</p>
            </div>
          )}
          {product.usage_guide && (
            <div className="p-4 bg-primary/5 rounded-xl">
              <h3 className="font-semibold mb-2 text-sm">Способ применения</h3>
              <p className="text-sm text-gray-600">{product.usage_guide}</p>
            </div>
          )}
        </div>
      </div>

      {/* Отзывы */}
      <div className="mb-16">
        <h2 className="font-heading text-2xl font-bold mb-6">Отзывы ({product.reviews?.length || 0})</h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map(r => (
              <div key={r.id} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{r.user_name}</span>
                  <StarRating rating={r.rating} size={14} />
                </div>
                <p className="text-gray-600 text-sm">{r.text}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 mb-8">Пока нет отзывов. Будьте первым!</p>}

        {user ? (
          <div className="card p-6 max-w-lg">
            <h3 className="font-semibold mb-4">Оставить отзыв</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">Ваша оценка</label>
              <StarRating rating={reviewForm.rating} onRate={r => setReviewForm(f => ({ ...f, rating: r }))} />
            </div>
            <textarea
              className="input mb-3 resize-none"
              rows={4}
              placeholder="Ваш отзыв..."
              value={reviewForm.text}
              onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
            />
            <button onClick={() => submitReview.mutate()} disabled={submitReview.isPending} className="btn-primary">
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

      {/* Похожие */}
      {related?.products?.length > 0 && (
        <div>
          <h2 className="font-heading text-2xl font-bold mb-6">Вам может понравиться</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.products.filter(p => p.id !== product.id).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}