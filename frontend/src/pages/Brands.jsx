import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const brands = [
  {
    name: 'Some By Mi',
    slug: 'Some By Mi',
    country: 'Корея',
    desc: 'Культовый бренд корейской косметики, известный революционной формулой с центеллой азиатской и ниацинамидом.',
    tags: ['очищение', 'увлажнение', 'осветление'],
    color: 'bg-rose-50',
  },
  {
    name: 'Bielenda',
    slug: 'Bielenda',
    country: 'Польша',
    desc: 'Европейский бренд с многолетней историей. Клинически проверенные формулы для требовательной кожи.',
    tags: ['сыворотки', 'кремы', 'маски'],
    color: 'bg-amber-50',
  },
  {
    name: 'Vitex',
    slug: 'Vitex',
    country: 'Беларусь',
    desc: 'Белорусский бренд натуральной косметики. Доступные цены и проверенные годами формулы.',
    tags: ['уход за лицом', 'волосы', 'тело'],
    color: 'bg-green-50',
  },
  {
    name: 'Elizavecca',
    slug: 'Elizavecca',
    country: 'Корея',
    desc: 'Инновационная корейская косметика с нестандартными ингредиентами: золото, коллаген, уголь.',
    tags: ['маски', 'очищение', 'питание'],
    color: 'bg-yellow-50',
  },
  {
    name: 'Missha',
    slug: 'Missha',
    country: 'Корея',
    desc: 'Один из пионеров K-beauty. Широкий ассортимент от тоников до солнцезащитных средств.',
    tags: ['тоники', 'bb-кремы', 'очищение'],
    color: 'bg-pink-50',
  },
  {
    name: 'Belkosmex',
    slug: 'Belkosmex',
    country: 'Беларусь',
    desc: 'Современная белорусская косметика. Мягкие гипоаллергенные формулы для всей семьи.',
    tags: ['чувствительная кожа', 'увлажнение'],
    color: 'bg-blue-50',
  },
]

export default function Brands() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 animate-fade-up">
        <p className="text-primary text-sm tracking-widest uppercase mb-3">наши партнёры</p>
        <h1 className="section-title">бренды</h1>
        <p className="text-gray-400 mt-3 max-w-lg">мы тщательно отбираем каждый бренд — только проверенные производители с прозрачным составом</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, i) => (
          <Link
            key={brand.name}
            to={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
            className="card p-8 group animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
          >
            <div className={`inline-block px-3 py-1 rounded-full text-xs text-gray-500 mb-4 ${brand.color}`}>
              {brand.country}
            </div>
            <h2 className="font-heading text-2xl font-light mb-3 group-hover:text-primary transition-colors lowercase">
              {brand.name}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{brand.desc}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {brand.tags.map(tag => (
                <span key={tag} className="text-xs bg-light px-3 py-1 rounded-full text-gray-500">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-dark font-medium group-hover:text-primary transition-colors">
              смотреть товары <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}