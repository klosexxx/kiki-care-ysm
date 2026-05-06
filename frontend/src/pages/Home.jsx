import useStore from '../store/useStore'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { user } = useStore()
  const heroRef = useRef(null)

  const { data } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => api.get('/products?limit=6&sort=rating').then(r => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

  // Параллакс на Hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* Hero — фото на всю ширину */}
<section className="relative h-[90vh] overflow-hidden flex items-end" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2419 50%, #1a1a1a 100%)' }}>
  <div ref={heroRef} className="absolute inset-0 will-change-transform">
    <img
      src="/hero-bg.jpg"
      alt="Kiki Care"
      className="w-full h-full object-cover opacity-75"
      onError={e => { e.target.style.display = 'none' }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    {/* Декоративные элементы когда нет фото */}
    <div className="absolute inset-0 flex items-center justify-center opacity-5">
      <span className="font-heading text-[30vw] font-light text-white leading-none select-none">KC</span>
    </div>
  </div>
  <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
    <div className="max-w-2xl animate-fade-up">
      <p className="text-white/60 text-sm tracking-widest uppercase mb-4">корейская косметика · тучково</p>
      <h1 className="font-heading text-6xl md:text-8xl font-light text-white leading-none mb-6">
        уход за кожей<br />с любовью
      </h1>
      <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
        скидка 10% на первую покупку при регистрации
      </p>
      <div className="flex gap-4 flex-wrap">
        <Link to="/catalog" className="inline-flex items-center gap-3 bg-white text-dark text-sm tracking-widest uppercase px-8 py-4 hover:bg-primary hover:text-white transition-all duration-300">
          в каталог <ArrowRight size={16} />
        </Link>
        {!user && (
          <Link to="/register" className="inline-flex items-center gap-3 border border-white text-white text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-dark transition-all duration-300">
            получить скидку
          </Link>
        )}
      </div>
    </div>
  </div>
</section>

      {/* Категории */}
      {categories?.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="section-title">категории</h2>
              <Link to="/catalog" className="text-sm text-gray-400 hover:text-dark transition-colors tracking-wider">все товары</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-gray-50 hover:bg-dark transition-all duration-500 p-8 animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                >
                  <p className="font-heading text-lg font-light group-hover:text-white transition-colors duration-300 lowercase">{cat.name}</p>
                  <ArrowRight size={14} className="mt-3 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Популярные товары */}
      <section className="py-20 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">популярное</h2>
              <p className="text-gray-400 text-sm mt-1 tracking-wide">по отзывам покупателей</p>
            </div>
            <Link to="/catalog" className="text-sm text-gray-400 hover:text-dark transition-colors tracking-wider flex items-center gap-1">
              смотреть все <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data?.products?.map((product, i) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Баннер скидка */}
<section className="py-24 px-4 bg-dark text-white">
  <div className="max-w-3xl mx-auto text-center">
    <p className="text-primary text-sm tracking-widest uppercase mb-4">специальное предложение</p>
    <h2 className="font-heading text-5xl md:text-6xl font-light mb-6 leading-tight">
      скидка 10%<br />на первую покупку
    </h2>
    <p className="text-white/50 mb-10 leading-relaxed">
      зарегистрируйтесь и получите скидку 10% на первый заказ в нашем магазине
    </p>
    {!user && (
      <Link to="/register" className="inline-flex items-center gap-3 border border-white/30 text-white text-sm tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-dark transition-all duration-300">
        зарегистрироваться <ArrowRight size={16} />
      </Link>
    )}
    {user && (
      <Link to="/catalog" className="inline-flex items-center gap-3 border border-white/30 text-white text-sm tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-dark transition-all duration-300">
        перейти в каталог <ArrowRight size={16} />
      </Link>
    )}
  </div>
</section>

      {/* Преимущества */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
          {[
            { title: 'натуральный состав', desc: 'только проверенные ингредиенты без вредной химии' },
            { title: 'дерматологически протестировано', desc: 'подходит для чувствительной кожи' },
            { title: 'быстрая доставка', desc: 'отправка в течение 24 часов после оформления' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 text-center hover:bg-light transition-colors duration-300">
              <div className="w-px h-8 bg-primary mx-auto mb-6" />
              <h3 className="font-heading text-xl font-light mb-3 lowercase">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}