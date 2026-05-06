import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import useStore from '../../store/useStore'
import api from '../../api/axios'

const marqueeItems = [
  'бесплатная доставка от 2000 ₽',
  'скидка 10% на первую покупку',
  'натуральный состав',
  'корейская косметика',
  'новинки каждую неделю',
  'дерматологически протестировано',
]

export default function Header() {
  const { user, logout, cartCount, wishlistCount, setCartCount, setWishlistCount } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const loadCounts = useCallback(async () => {
  if (!user) return
  try {
    const [cart, wish] = await Promise.all([api.get('/cart'), api.get('/wishlist')])
    setCartCount(cart.data.length)
    setWishlistCount(wish.data.length)
  } catch (err) {
    console.error('Ошибка загрузки счётчиков:', err)
  }
}, [user, setCartCount, setWishlistCount])

  useEffect(() => { loadCounts() }, [loadCounts])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { to: '/', label: 'главная' },
    { to: '/catalog', label: 'каталог' },
    { to: '/brands', label: 'бренды' },
    { to: '/stores', label: 'магазины' },
  ]

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Бегущая строка */}
      <div className="bg-dark text-white text-xs py-2 overflow-hidden">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 uppercase tracking-widest opacity-80">
              {item} <span className="text-primary mx-4">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Основная шапка */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-heading text-3xl font-light tracking-widest text-dark hover:text-primary transition-colors">
            kiki care
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wider transition-colors lowercase ${location.pathname === link.to ? 'text-primary border-b border-primary' : 'text-gray-500 hover:text-dark'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="relative p-2 text-gray-500 hover:text-dark transition-colors">
                  <User size={18} />
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-500 hover:text-dark transition-colors">
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-dark text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile?tab=wishlist" className="relative p-2 text-gray-500 hover:text-dark transition-colors">
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-dark text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="p-2 text-gray-500 hover:text-dark transition-colors">
                    <Shield size={18} />
                  </Link>
                )}
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-xs px-5 py-2.5">войти</Link>
            )}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 animate-fade-in">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="block py-3 text-sm text-gray-600 hover:text-dark border-b border-gray-50 lowercase tracking-wider" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}