import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '+7' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { setUser } = useStore()
  const navigate = useNavigate()

  const handlePhone = (e) => {
    let val = e.target.value
    // Всегда начинается с +7
    if (!val.startsWith('+7')) val = '+7'
    // Только цифры после +7
    const digits = val.slice(2).replace(/\D/g, '').slice(0, 10)
    setForm({ ...form, phone: '+7' + digits })
    if (errors.phone) setErrors({ ...errors, phone: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'введите имя (минимум 2 символа)'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'введите корректный email'
    if (form.phone.replace(/\D/g, '').length !== 11)
      e.phone = 'номер должен содержать 11 цифр (пример: +79001234567)'
    if (form.password.length < 6)
      e.password = 'пароль минимум 6 символов'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        ...form,
        phone: form.phone.replace(/\D/g, ''),
      })
      setUser(data.user, data.token)
      toast.success('Аккаунт создан!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Регистрация</h1>
          <p className="text-gray-500">Создайте аккаунт в Kiki Care</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                className={`input ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Ваше имя"
                value={form.name}
                maxLength={60}
                onChange={e => {
                  const val = e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z\s-]/g, '')
                  setForm({ ...form, name: val })
                  if (errors.name) setErrors({ ...errors, name: '' })
                }}
                required
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-300' : ''}`}
                placeholder="your@email.com"
                value={form.email}
                maxLength={100}
                onChange={e => {
                  setForm({ ...form, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: '' })
                }}
                required
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input
                type="tel"
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

            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input
                type="password"
                className={`input ${errors.password ? 'border-red-300' : ''}`}
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={e => {
                  setForm({ ...form, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                required
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}