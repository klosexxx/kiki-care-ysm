import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Package, Heart, User, LogOut, X } from 'lucide-react'
import api from '../api/axios'
import useStore from '../store/useStore'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  created: 'Создан',
  paid: 'Оплачен',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}
const STATUS_COLOR = {
  created: 'bg-gray-100 text-gray-600',
  paid: 'bg-blue-100 text-blue-600',
  processing: 'bg-yellow-100 text-yellow-600',
  shipped: 'bg-purple-100 text-purple-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Profile() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then(r => r.data),
    enabled: !!user,
  })

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data),
    enabled: !!user,
  })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      queryClient.invalidateQueries(['wishlist'])
      toast('удалено из избранного')
    } catch {
      toast.error('ошибка')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">личный кабинет</h1>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-outline flex items-center gap-2 text-sm">
          <LogOut size={16} /> выйти
        </button>
      </div>

      {/* Вкладки */}
      <div className="flex gap-1 mb-8 border-b border-gray-100">
        {[
          { key: 'orders', label: 'заказы', icon: <Package size={15} /> },
          { key: 'wishlist', label: 'избранное', icon: <Heart size={15} /> },
          { key: 'info', label: 'профиль', icon: <User size={15} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px lowercase tracking-wider ${
              tab === t.key
                ? 'border-dark text-dark'
                : 'border-transparent text-gray-400 hover:text-dark'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Заказы */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 mb-4">заказов пока нет</p>
              <Link to="/catalog" className="btn-primary">в каталог</Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-sm">заказ №{order.id}</span>
                    <span className="text-xs text-gray-400 ml-3">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[order.status] || STATUS_COLOR.created}`}>
                    {STATUS_MAP[order.status] || order.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items?.map((item, i) => (
                    <p key={i} className="text-sm text-gray-500">
                      {item.title} ×{item.quantity} — {item.price * item.quantity} ₽
                    </p>
                  ))}
                </div>
                <p className="font-semibold text-primary text-sm">итого: {order.total} ₽</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Избранное */}
      {tab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400">список желаний пуст</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlist.map(item => (
                <div key={item.id} className="relative">
                  <ProductCard
                    product={{
                      ...item,
                      id: item.product_id,
                      main_image: item.image,
                    }}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow text-red-400 hover:bg-red-50 transition-colors z-10"
                    title="Удалить из избранного"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Профиль */}
      {tab === 'info' && (
        <div className="card p-6 max-w-md">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">имя</label>
              <p className="font-medium mt-1">{user?.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">email</label>
              <p className="font-medium mt-1">{user?.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">роль</label>
              <p className="font-medium mt-1">
                {user?.role === 'admin' ? 'администратор' : 'покупатель'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}