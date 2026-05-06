import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { Package, ShoppingBag, MessageSquare } from 'lucide-react'
import useStore from '../../store/useStore'

export default function AdminLayout() {
  const { user } = useStore()
  const location = useLocation()

  if (!user || user.role !== 'admin') return <Navigate to="/login" />

  const tabs = [
    { to: '/admin', label: 'товары', icon: <Package size={15} /> },
    { to: '/admin/orders', label: 'заказы', icon: <ShoppingBag size={15} /> },
    { to: '/admin/reviews', label: 'отзывы', icon: <MessageSquare size={15} /> },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">панель администратора</h1>
      <div className="flex gap-1 mb-8 border-b border-gray-100">
        {tabs.map(tab => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px lowercase tracking-wider ${location.pathname === tab.to ? 'border-dark text-dark' : 'border-transparent text-gray-400 hover:text-dark'}`}
          >
            {tab.icon} {tab.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  )
}