import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import api from '../api/axios'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function Cart() {
  const { user, setCartCount } = useStore()
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: !!user,
  })

  const updateQty = useMutation({
    mutationFn: ({ id, quantity }) => api.put(`/cart/${id}`, { quantity }),
    onSuccess: () => { queryClient.invalidateQueries(['cart']); setCartCount(items.length) },
  })

  const removeItem = useMutation({
    mutationFn: (id) => api.delete(`/cart/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['cart']); toast('Товар удалён'); setCartCount(Math.max(0, items.length - 1)) },
  })

  if (!user) return (
    <div className="text-center py-20">
      <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
      <p className="text-gray-400 mb-4">Войдите чтобы просмотреть корзину</p>
      <Link to="/login" className="btn-primary">Войти</Link>
    </div>
  )

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse"><div className="h-64 bg-gray-100 rounded-2xl" /></div>

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) return (
    <div className="text-center py-20">
      <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
      <p className="text-gray-400 mb-4">Корзина пуста</p>
      <Link to="/catalog" className="btn-primary">В каталог</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-8">Корзина</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img
                src={item.image ? `http://localhost:5000${item.image}` : 'https://placehold.co/100x100/faf8f5/c8a882?text=KC'}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-400">{item.brand}</p>
                <p className="font-medium text-sm mb-2">{item.title}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden text-sm">
                    <button onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity - 1 })} className="px-3 py-1 hover:bg-gray-50">−</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity + 1 })} className="px-3 py-1 hover:bg-gray-50">+</button>
                  </div>
                  <span className="font-semibold text-primary">{item.price * item.quantity} ₽</span>
                </div>
              </div>
              <button onClick={() => removeItem.mutate(item.id)} className="text-gray-300 hover:text-red-400 transition-colors self-start">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Итого</h3>
          <div className="flex justify-between mb-2 text-sm"><span className="text-gray-500">Товары ({items.length})</span><span>{total} ₽</span></div>
          <div className="flex justify-between mb-6 text-sm"><span className="text-gray-500">Доставка</span><span className="text-green-500">Бесплатно</span></div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4 mb-6"><span>К оплате</span><span className="text-primary">{total} ₽</span></div>
          <Link to="/checkout" className="btn-primary w-full block text-center">Оформить заказ</Link>
        </div>
      </div>
    </div>
  )
}