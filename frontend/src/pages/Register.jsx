import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { setUser } = useStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Пароль минимум 6 символов'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
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
              <input type="text" className="input" placeholder="Ваше имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Телефон</label>
              <input type="tel" className="input" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input type="password" className="input" placeholder="Минимум 6 символов" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Уже есть аккаунт? <Link to="/login" className="text-primary hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}