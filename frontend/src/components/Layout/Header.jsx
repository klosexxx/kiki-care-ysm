import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import useStore from '../../store/useStore'
import api from '../../api/axios'
import { getGuestCartCount } from '../../utils/guestCart'

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
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const loadCounts = useCallback(async () => {
    if (!user) {
      setCartCount(getGuestCartCount())
      return
    }
    try {
      const [cart, wish] = await Promise.all([api.get('/cart'), api.get('/wishlist')])
      setCartCount(cart.data.length)
      setWishlistCount(wish.data.length)
    } catch (err) {
      console.error('Ошибка загрузки счётчиков:', err)
    }
  }, [user, setCartCount, setWishlistCount])

  useEffect(() => { loadCounts() }, [loadCounts])

  useEffect(() => {
    const handler = () => setCartCount(getGuestCartCount())
    window.addEventListener('guest-cart-updated', handler)
    return () => window.removeEventListener('guest-cart-updated', handler)
  }, [setCartCount])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { to: '/', label: 'главная' },
    { to: '/catalog', label: 'каталог' },
    { to: '/brands', label: 'бренды' },
    { to: '/stores', label: 'магазины' },
  ]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>

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

      {/* ─── МОБИЛЬНАЯ ШАПКА ─── */}
      <div className="md:hidden border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">

          {/* Профиль */}
          <Link
            to={user ? '/profile' : '/login'}
            className="icon-btn flex-1 flex justify-center"
            title="Профиль"
          >
            <User size={22} />
          </Link>

          {/* Избранное */}
          <Link
            to={user ? '/profile?tab=wishlist' : '/login'}
            className="icon-btn flex-1 flex justify-center relative"
            title="Избранное"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </Link>

          {/* KC — логотип по центру */}
<Link
  to="/"
  className="flex-1 flex justify-center"
  title="Главная"
>
  <span
    className="w-11 h-11 rounded-full border border-[#b89d7a] flex items-center
               justify-center hover:border-primary transition-colors shrink-0"
  >
    <span className="font-heading text-[13px] font-light tracking-[0.05em] text-[#7a6a58] flex items-center gap-[3px]">
      <span>k</span>
      <span className="w-px h-3 bg-[#b89d7a] inline-block" />
      <span>c</span>
    </span>
  </span>
</Link>

          {/* Корзина */}
          <Link
            to="/cart"
            className="icon-btn flex-1 flex justify-center relative"
            title="Корзина"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </Link>

          {/* Бургер */}
          <button
            className="icon-btn flex-1 flex justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* ─── ДЕСКТОПНАЯ ШАПКА ─── */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-8">

          {/* Логотип */}
          <Link
            to="/"
            className="font-heading text-3xl font-light tracking-widest text-dark hover:text-primary transition-colors shrink-0"
          >
            kiki care
          </Link>

          {/* Навигация */}
          <nav className="flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  relative px-4 py-2 text-sm font-medium tracking-widest lowercase
                  transition-colors duration-200 rounded-lg
                  ${isActive(link.to)
                    ? 'text-dark bg-light'
                    : 'text-gray-400 hover:text-dark hover:bg-gray-50'
                  }
                `}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Иконки */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Link to="/profile" className="icon-btn" title="Профиль">
                  <User size={20} />
                </Link>
                <Link to="/cart" className="icon-btn relative" title="Корзина">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </Link>
                <Link to="/profile?tab=wishlist" className="icon-btn relative" title="Избранное">
                  <Heart size={20} />
                  {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="icon-btn" title="Администратор">
                    <Shield size={20} />
                  </Link>
                )}
                <button onClick={handleLogout} className="icon-btn hover:!text-red-400" title="Выйти">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="icon-btn" title="Войти">
                  <User size={20} />
                </Link>
                <Link to="/login" className="icon-btn" title="Избранное">
                  <Heart size={20} />
                </Link>
                <Link to="/cart" className="icon-btn relative" title="Корзина">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </Link>
                <Link to="/login" className="ml-2 btn-primary text-xs px-5 py-2.5 tracking-widest">
                  войти
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ─── МОБИЛЬНОЕ МЕНЮ (выпадашка) ─── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 animate-fade-in">

          {/* Навигационные ссылки */}
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 text-sm border-b border-gray-50 lowercase tracking-widest font-medium transition-colors ${
                isActive(link.to) ? 'text-dark' : 'text-gray-400 hover:text-dark'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Войти / Регистрация — только для гостей */}
          {!user && (
            <div className="pt-4 flex gap-3">
              <Link
                to="/login"
                className="btn-primary text-xs flex-1 text-center py-3 tracking-widest"
                onClick={() => setMenuOpen(false)}
              >
                войти
              </Link>
              <Link
                to="/register"
                className="btn-outline text-xs flex-1 text-center py-3 tracking-widest"
                onClick={() => setMenuOpen(false)}
              >
                регистрация
              </Link>
            </div>
          )}

          {/* Выйти — только для авторизованных */}
          {user && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              className="mt-4 w-full text-left py-3 text-sm text-gray-400 hover:text-red-400 tracking-widest lowercase transition-colors"
            >
              выйти
            </button>
          )}

        </div>
      )}

    </header>
  )
}