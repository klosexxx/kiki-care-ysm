import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { Check, AlertCircle } from 'lucide-react'
import api from '../api/axios'
import useStore from '../store/useStore'
import { getGuestCart, saveGuestCart } from '../utils/guestCart'
import toast from 'react-hot-toast'

function sanitize(str) {
  return String(str)
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#x2F;').trim()
}

export default function Checkout() {
  const { user, setCartCount } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const buyNowItem = location.state?.buyNowItem || null

  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '+7',
    email: user?.email || '',
    address: '',
    comment: '',
  })

  const { data: dbItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then(r => r.data),
    enabled: !!user && !buyNowItem,
  })

  const getItems = () => {
    if (buyNowItem) return [buyNowItem]
    if (user) return dbItems
    return getGuestCart()
  }

  const items = getItems()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handlePhone = (e) => {
    let val = e.target.value
    if (!val.startsWith('+7')) val = '+7'
    const digits = val.slice(2).replace(/\D/g, '').slice(0, 10)
    setForm({ ...form, phone: '+7' + digits })
    if (errors.phone) setErrors({ ...errors, phone: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'введите имя (минимум 2 символа)'
    if (!form.phone || form.phone.replace(/\D/g, '').length !== 11)
      e.phone = 'номер должен содержать ровно 11 цифр (пример: +79001234567)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'введите корректный email'
    if (!form.address.trim())
      e.address = 'укажите адрес доставки'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const createOrder = useMutation({
    mutationFn: () => api.post('/orders', {
      name: sanitize(form.name),
      phone: form.phone.replace(/\D/g, ''),
      email: sanitize(form.email),
      address: sanitize(form.address),
      comment: sanitize(form.comment),
      total,
      items: items.map(i => ({
        product_id: i.product_id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image || null,
      })),
      is_guest: !user,
    }),
    onSuccess: (res) => {
      setOrderId(res.data.order.id)
      if (!buyNowItem) {
        if (user) queryClient.invalidateQueries(['cart'])
        else saveGuestCart([])
        setCartCount(0)
      }
      setStep(3)
    },
    onError: () => toast.error('ошибка при создании заказа'),
  })

  const handleNext = () => {
    if (!validate()) return
    setStep(2)
  }

  // Шаг 3 — успех
  if (step === 3) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center animate-fade-up">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <Check size={36} className="text-green-500" />
      </div>
      <h1 className="section-title mb-4">заказ оформлен</h1>
      <p className="text-gray-500 mb-2">заказ №{orderId} успешно создан</p>
      <p className="text-gray-400 text-sm mb-10 leading-relaxed">
        мы свяжемся с вами по номеру {form.phone} для подтверждения и уточнения деталей
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={() => navigate('/catalog')} className="btn-outline">
          в каталог
        </button>
        {user ? (
          <button onClick={() => navigate('/profile')} className="btn-primary">
            мои заказы
          </button>
        ) : (
          <button onClick={() => navigate('/register')} className="btn-primary">
            создать аккаунт
          </button>
        )}
      </div>
    </div>
  )

  // Шаг 2 — подтверждение
  if (step === 2) return (
    <div className="max-w-lg mx-auto px-4 py-16 animate-fade-up">
      <h1 className="section-title mb-8">подтверждение</h1>
      <div className="card p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            проверьте данные перед оформлением заказа
          </p>
        </div>

        <div className="space-y-1 mb-6">
          {[
            ['получатель', form.name],
            ['телефон', form.phone],
            ['email', form.email || '—'],
            ['адрес', form.address],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-right max-w-[60%]">{value}</span>
            </div>
          ))}
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-gray-400">сумма</span>
            <span className="font-bold text-primary text-base">{total} ₽</span>
          </div>
        </div>

        <div className="bg-light rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">состав заказа</p>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1">{item.title} ×{item.quantity}</span>
                <span className="shrink-0 ml-2">{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
          после подтверждения мы свяжемся с вами для согласования оплаты и доставки
        </p>

        <div className="flex gap-3">
          <button onClick={() => setStep(1)} className="btn-outline flex-1">изменить</button>
          <button
            onClick={() => createOrder.mutate()}
            disabled={createOrder.isPending}
            className="btn-primary flex-1"
          >
            {createOrder.isPending ? 'оформляем...' : 'подтвердить заказ'}
          </button>
        </div>
      </div>
    </div>
  )

  // Шаг 1 — форма
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-up">
      <h1 className="section-title mb-10">оформление заказа</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card p-8 space-y-5">

          {/* Имя */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">имя *</label>
            <input
              className={`input ${errors.name ? 'border-red-300' : ''}`}
              placeholder="Ваше имя"
              value={form.name}
              maxLength={60}
              onChange={e => {
                const val = e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z\s-]/g, '')
                setForm({ ...form, name: val })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">телефон *</label>
            <input
              className={`input ${errors.phone ? 'border-red-300' : ''}`}
              placeholder="+79001234567"
              value={form.phone}
              inputMode="numeric"
              onChange={handlePhone}
            />
            <p className="text-gray-400 text-xs mt-1">
              {form.phone.replace(/\D/g, '').length} / 11 цифр
            </p>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">email</label>
            <input
              className={`input ${errors.email ? 'border-red-300' : ''}`}
              type="email"
              placeholder="your@email.com"
              value={form.email}
              maxLength={100}
              onChange={e => {
                setForm({ ...form, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Адрес */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">адрес доставки *</label>
            <input
              className={`input ${errors.address ? 'border-red-300' : ''}`}
              placeholder="Город, улица, дом, квартира"
              value={form.address}
              maxLength={200}
              onChange={e => {
                setForm({ ...form, address: e.target.value })
                if (errors.address) setErrors({ ...errors, address: '' })
              }}
            />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">комментарий</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Дополнительные пожелания к заказу"
              value={form.comment}
              maxLength={500}
              onChange={e => setForm({ ...form, comment: e.target.value })}
            />
          </div>

          <button onClick={handleNext} className="btn-primary w-full">
            перейти к подтверждению
          </button>
        </div>

        {/* Итого */}
        <div className="card p-6 h-fit sticky top-24">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">ваш заказ</p>
          <div className="space-y-3 mb-4">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500 line-clamp-1">{item.title} ×{item.quantity}</span>
                <span className="font-medium ml-2 shrink-0">{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-medium text-sm">итого</span>
            <span className="font-bold text-primary">{total} ₽</span>
          </div>
        </div>
      </div>
    </div>
  )
}