import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const STATUSES = ['created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_MAP = { created: 'Создан', paid: 'Оплачен', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' }

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => api.get('/admin/orders').then(r => r.data) })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/orders/${id}`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-orders']); toast.success('Статус обновлён') },
  })

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-semibold">Заказ №{order.id}</p>
              <p className="text-sm text-gray-500">{order.name} · {order.phone}</p>
              <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('ru-RU')}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value })}
                className="input text-sm py-2 w-auto"
              >
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_MAP[s]}</option>)}
              </select>
              <span className="font-bold text-primary">{order.total} ₽</span>
            </div>
          </div>
          <div className="space-y-1">
            {order.items?.map((item, i) => (
              <p key={i} className="text-sm text-gray-500">{item.title} ×{item.quantity} — {item.price * item.quantity} ₽</p>
            ))}
          </div>
          {order.address && <p className="text-xs text-gray-400 mt-2">📍 {order.address}</p>}
        </div>
      ))}
      {orders.length === 0 && <div className="text-center py-16 text-gray-400">Заказов пока нет</div>}
    </div>
  )
}