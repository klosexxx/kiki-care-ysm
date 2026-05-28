import { useState, useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Leaf, FlaskConical, PackageCheck, Gem, MessageCircle,
} from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

// ── SVG иконки категорий ──────────────────────────────────

const IconSerums = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="20" y="14" width="8" height="20" rx="4" stroke="currentColor" strokeWidth="1.8"/>
    <ellipse cx="24" cy="13" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M24 34 L24 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M24 40 C24 40 21.5 43.5 21.5 45 C21.5 46.4 22.6 47.5 24 47.5 C25.4 47.5 26.5 46.4 26.5 45 C26.5 43.5 24 40 24 40Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M20 25 Q24 23 28 25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="18" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="31" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)

const IconFaceCreams = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="10" y="20" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M14 20 L14 16 C14 13.8 15.8 12 18 12 L30 12 C32.2 12 34 13.8 34 16 L34 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 30 Q24 34 32 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M19 25 L29 25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const IconCleansing = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M24 8 C24 8 12 18 12 28 C12 34.6 17.4 40 24 40 C30.6 40 36 34.6 36 28 C36 18 24 8 24 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="19" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="28" cy="30" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="26" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

const IconEyeCare = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M6 24 C6 24 12 12 24 12 C36 12 42 24 42 24 C42 24 36 36 24 36 C12 36 6 24 6 24Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
    <path d="M30 12 C30 12 32 9 35 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M18 12 C18 12 16 9 13 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const IconMasks = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <ellipse cx="24" cy="25" rx="14" ry="17" stroke="currentColor" strokeWidth="1.8"/>
    <ellipse cx="18" cy="21" rx="3.5" ry="2" stroke="currentColor" strokeWidth="1.6"/>
    <ellipse cx="30" cy="21" rx="3.5" ry="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M19 31 Q24 35 29 31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 12 C10 12 9 14.5 11 14.5 C13 14.5 12 12 12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M36 8 C36 8 35 11 37 11 C39 11 38 8 38 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const IconSunProtection = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M24 6 L24 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M24 38 L24 42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 24 L10 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M38 24 L42 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M11.5 11.5 L14.3 14.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M33.7 33.7 L36.5 36.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M36.5 11.5 L33.7 14.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M14.3 33.7 L11.5 36.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const IconMakeup = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="20" y="20" width="8" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M20 24 L28 24" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M20 20 L22 12 L24 10 L26 12 L28 20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M22 12 L26 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="34" cy="16" r="5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M34 13 L34 16 L36 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconHair = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M14 10 C14 10 8 16 10 24 C12 32 20 32 20 24 C20 18 15 16 16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 8 C24 8 18 15 20 23 C22 31 30 30 29 22 C28 16 23 15 24 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33 11 C33 11 28 17 30 24 C32 31 39 30 38 23 C37 17 32 16 33 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 35 Q13 40 16 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M20 36 Q24 41 27 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M30 35 Q33 40 36 37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const IconBody = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <rect x="15" y="18" width="18" height="22" rx="4" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="19" y="13" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="21" y="10" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M24 24 C24 24 21 28 21 30 C21 31.7 22.3 33 24 33 C25.7 33 27 31.7 27 30 C27 28 24 24 24 24Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

// slug → иконка
const CATEGORY_ICONS = {
  'serums':          IconSerums,
  'face-creams':     IconFaceCreams,
  'cleansing':       IconCleansing,
  'eye-care':        IconEyeCare,
  'masks':           IconMasks,
  'sun-protection':  IconSunProtection,
  'makeup':          IconMakeup,
  'hair':            IconHair,
  'body':            IconBody,
}

// ── Карусель преимуществ ──────────────────────────────────

const WHY_ITEMS = [
  {
    Icon: Leaf,
    title: 'натуральный состав',
    desc: 'только проверенные ингредиенты без вредной химии — каждый продукт проходит тщательный отбор',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    Icon: FlaskConical,
    title: 'дерматологически протестировано',
    desc: 'все средства подходят для чувствительной кожи и прошли клинические исследования',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    Icon: PackageCheck,
    title: 'быстрая доставка',
    desc: 'отправляем в течение 24 часов после оформления заказа по всей России',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    Icon: Gem,
    title: 'отборное качество',
    desc: 'каждый бренд в нашем каталоге прошёл проверку — только лучшее для вашей кожи',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    Icon: MessageCircle,
    title: 'живая консультация',
    desc: 'поможем подобрать уход под ваш тип кожи — в магазине или онлайн',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100 text-rose-600',
  },
]

function WhyCarousel() {
  const [active, setActive] = useState(0)
  const total = WHY_ITEMS.length
  const prev = () => setActive(a => (a - 1 + total) % total)
  const next = () => setActive(a => (a + 1) % total)
  const visible = [-1, 0, 1].map(offset => {
    const index = (active + offset + total) % total
    return { ...WHY_ITEMS[index], offset }
  })

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4 min-h-[240px]">
        {visible.map(({ Icon, title, desc, color, iconBg, offset }) => (
          <div
            key={title + offset}
            onClick={() => { if (offset === -1) prev(); if (offset === 1) next() }}
            className={`
              rounded-2xl border-2 p-7 flex flex-col gap-5 transition-all duration-500
              ${offset === 0
                ? `${color} w-full md:w-[460px] shadow-md scale-100 opacity-100 cursor-default`
                : 'bg-white border-gray-100 w-[180px] md:w-[240px] scale-90 opacity-40 cursor-pointer hover:opacity-60 hidden md:flex'
              }
            `}
          >
            <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold mb-2 lowercase tracking-tight">{title}</h3>
              {offset === 0 && <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-dark hover:text-dark transition-colors"
        >
          <ArrowRight size={16} className="rotate-180" />
        </button>
        <div className="flex gap-2">
          {WHY_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'w-6 h-2 bg-dark' : 'w-2 h-2 bg-gray-200 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-dark hover:text-dark transition-colors"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Основной компонент ────────────────────────────────────

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

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>

      {/* ── Hero ── */}
      <section
        className="relative h-[90vh] overflow-hidden flex items-end"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2419 50%, #1a1a1a 100%)' }}
      >
        <div ref={heroRef} className="absolute inset-0 will-change-transform">
          <img
            src="/hero-bg.jpg"
            alt="Kiki Care"
            className="w-full h-full object-cover opacity-75"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <span className="font-heading text-[30vw] font-light text-white leading-none select-none">KC</span>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-5">корейская косметика · тучково</p>
            <h1 className="font-heading text-6xl md:text-8xl font-light text-white leading-none mb-6">
              уход за кожей<br />с любовью
            </h1>
            <p className="text-white/60 text-base mb-10 leading-relaxed max-w-sm">
              скидка 10% на первую покупку при регистрации
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/catalog" className="inline-flex items-center gap-3 bg-white text-dark text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary hover:text-white transition-all duration-300">
                в каталог <ArrowRight size={14} />
              </Link>
              {!user && (
                <Link to="/register" className="inline-flex items-center gap-3 border border-white/40 text-white text-xs tracking-[0.15em] uppercase px-8 py-4 hover:bg-white hover:text-dark transition-all duration-300">
                  получить скидку
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Категории ── */}
      {categories?.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-primary text-xs tracking-[0.25em] uppercase mb-3">ассортимент</p>
                <h2 className="font-heading text-5xl md:text-6xl font-light lowercase tracking-tight">категории</h2>
              </div>
              <Link to="/catalog" className="text-xs text-gray-400 hover:text-dark transition-colors tracking-[0.15em] uppercase flex items-center gap-2">
                все товары <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat, i) => {
                const Icon = CATEGORY_ICONS[cat.slug] || IconSerums
                return (
                  <Link
                    key={cat.id}
                    to={`/catalog?category=${cat.slug}`}
                    className="group overflow-hidden rounded-2xl bg-[#faf8f5] border-2 border-transparent hover:border-primary/30 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col gap-4 animate-fade-up"
                    style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300 text-primary shadow-sm">
                      <Icon />
                    </div>
                    <p className="font-heading text-lg font-light text-dark group-hover:text-primary transition-colors duration-300 lowercase leading-tight">
                      {cat.name}
                    </p>
                    <ArrowRight size={14} className="text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Популярные товары ── */}
      <section className="py-24 px-4 bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-heading text-5xl md:text-6xl font-light lowercase tracking-tight">популярное</h2>
              <p className="text-gray-400 text-sm mt-2 tracking-wide">по отзывам покупателей</p>
            </div>
            <Link to="/catalog" className="text-xs text-gray-400 hover:text-dark transition-colors tracking-[0.15em] uppercase flex items-center gap-2">
              смотреть все <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
            {data?.products?.map((product, i) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Баннер скидка ── */}
      <section className="py-28 px-4 bg-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-5">специальное предложение</p>
          <h2 className="font-heading text-5xl md:text-7xl font-light mb-6 leading-tight">
            скидка 10%<br />на первую покупку
          </h2>
          <p className="text-white/40 text-sm mb-12 leading-relaxed max-w-sm mx-auto">
            зарегистрируйтесь и получите скидку на первый заказ в нашем магазине
          </p>
          {!user ? (
            <Link to="/register" className="inline-flex items-center gap-3 border border-white/20 text-white text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-dark transition-all duration-300">
              зарегистрироваться <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to="/catalog" className="inline-flex items-center gap-3 border border-white/20 text-white text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-dark transition-all duration-300">
              перейти в каталог <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </section>

      {/* ── Почему Kiki Care ── */}
      <section className="py-24 px-4 bg-light overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-primary text-xs tracking-[0.25em] uppercase mb-3">наши принципы</p>
            <h2 className="font-heading text-5xl md:text-6xl font-light lowercase tracking-tight">почему kiki care</h2>
          </div>
          <WhyCarousel />
        </div>
      </section>

    </div>
  )
}