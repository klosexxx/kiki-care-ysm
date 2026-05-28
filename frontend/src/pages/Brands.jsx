import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, Sparkles, Leaf, Droplets, Star, Zap, Flower2, Scissors } from 'lucide-react'

const brands = [
  {
    name: 'JIGOTT',
    slug: 'JIGOTT',
    country: 'Корея',
    icon: <FlaskConical size={22} strokeWidth={1.5} />,
    desc: 'Один из ключевых брендов нашего магазина. Широкая линейка: сыворотки с ретинолом, зелёным чаем и центеллой, антивозрастные кремы, кремы для глаз и подарочные наборы.',
    tags: ['сыворотки', 'кремы', 'наборы'],
    accent: 'bg-amber-50 border-amber-100 hover:border-amber-300',
    iconBg: 'bg-amber-100 text-amber-600',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'CELIMAX',
    slug: 'CELIMAX',
    country: 'Корея',
    icon: <Sparkles size={22} strokeWidth={1.5} />,
    desc: 'Корейский бренд с инновационными формулами для жирной и комбинированной кожи. Специализируется на контроле жирности, осветлении и надёжной солнцезащите.',
    tags: ['жирная кожа', 'осветление', 'SPF'],
    accent: 'bg-rose-50 border-rose-100 hover:border-rose-300',
    iconBg: 'bg-rose-100 text-rose-600',
    tagColor: 'bg-rose-100 text-rose-700',
  },
  {
    name: 'Esthetic House',
    slug: 'Esthetic House',
    country: 'Корея',
    icon: <Droplets size={22} strokeWidth={1.5} />,
    desc: 'Культовые ампульные сыворотки с высокой концентрацией активных компонентов: коллаген, чайное дерево, витамин С. Профессиональный уход в домашних условиях.',
    tags: ['ампулы', 'антивозраст', 'витамин С'],
    accent: 'bg-pink-50 border-pink-100 hover:border-pink-300',
    iconBg: 'bg-pink-100 text-pink-600',
    tagColor: 'bg-pink-100 text-pink-700',
  },
  {
    name: 'LEBELAGE',
    slug: 'LEBELAGE',
    country: 'Корея',
    icon: <Flower2 size={22} strokeWidth={1.5} />,
    desc: 'Доступный корейский бренд с богатым ассортиментом: ночные маски, гели с углём, кремы для глаз и очищающие пенки. Отличное соотношение цены и качества.',
    tags: ['маски', 'уход за глазами', 'очищение'],
    accent: 'bg-purple-50 border-purple-100 hover:border-purple-300',
    iconBg: 'bg-purple-100 text-purple-600',
    tagColor: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Physicians Formula',
    slug: 'Physicians Formula',
    country: 'США',
    icon: <Star size={22} strokeWidth={1.5} />,
    desc: 'Американский бренд декоративной косметики с тропическими маслами мурумуру. Гипоаллергенные формулы, разработанные дерматологами. Cruelty Free.',
    tags: ['пудра', 'тушь', 'бронзер'],
    accent: 'bg-yellow-50 border-yellow-100 hover:border-yellow-300',
    iconBg: 'bg-yellow-100 text-yellow-600',
    tagColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    name: 'Holika Holika',
    slug: 'Holika Holika',
    country: 'Корея',
    icon: <Leaf size={22} strokeWidth={1.5} />,
    desc: 'Популярный корейский бренд с игривой концепцией. Питательные пенки с натуральными экстрактами цветов и растений для нежного очищения и ухода.',
    tags: ['очищение', 'питание', 'цветочные экстракты'],
    accent: 'bg-green-50 border-green-100 hover:border-green-300',
    iconBg: 'bg-green-100 text-green-600',
    tagColor: 'bg-green-100 text-green-700',
  },
  {
    name: 'ВИТЭКС',
    slug: 'ВИТЭКС',
    country: 'Беларусь',
    icon: <Sparkles size={22} strokeWidth={1.5} />,
    desc: 'Ведущий белорусский бренд косметики. Жидкие и стойкие матовые помады, а также питательные кремы для тела с маслом арганы по доступной цене.',
    tags: ['помады', 'уход за телом', 'аргана'],
    accent: 'bg-blue-50 border-blue-100 hover:border-blue-300',
    iconBg: 'bg-blue-100 text-blue-600',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'LaDor',
    slug: 'LaDor',
    country: 'Корея',
    icon: <Scissors size={22} strokeWidth={1.5} />,
    desc: 'Профессиональный корейский бренд ухода за волосами. Тонирующие средства для осветлённых и блондинистых волос, устраняющие желтизну.',
    tags: ['волосы', 'тонирование', 'профессиональный'],
    accent: 'bg-slate-50 border-slate-100 hover:border-slate-300',
    iconBg: 'bg-slate-100 text-slate-600',
    tagColor: 'bg-slate-100 text-slate-700',
  },
  {
    name: 'Med2b',
    slug: 'Med2b',
    country: 'Корея',
    icon: <Zap size={22} strokeWidth={1.5} />,
    desc: 'Корейский бренд инновационного очищения на основе соды. Пенки с натуральными фруктовыми экстрактами — дыня и голубика — для мягкого и эффективного ухода.',
    tags: ['пенки', 'сода', 'фруктовые экстракты'],
    accent: 'bg-orange-50 border-orange-100 hover:border-orange-300',
    iconBg: 'bg-orange-100 text-orange-600',
    tagColor: 'bg-orange-100 text-orange-700',
  },
]

export default function Brands() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">

      <div className="mb-14 animate-fade-up">
        <p className="text-primary text-xs tracking-widest uppercase mb-3">наши партнёры</p>
        <h1 className="font-heading text-5xl md:text-6xl font-light lowercase tracking-tight">
          бренды
        </h1>
        <p className="text-gray-400 mt-4 max-w-lg leading-relaxed text-sm">
          мы тщательно отбираем каждый бренд — только проверенные производители с прозрачным составом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brands.map((brand, i) => (
          <Link
            key={brand.name}
            to={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
            className={`group rounded-2xl border-2 p-7 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up ${brand.accent}`}
            style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${brand.iconBg}`}>
                {brand.icon}
              </div>
              <span className="text-xs text-gray-400 tracking-wider">{brand.country}</span>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-semibold mb-2 group-hover:text-dark transition-colors">
                {brand.name}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">{brand.desc}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {brand.tags.map(tag => (
                  <span key={tag} className={`text-xs px-3 py-1 rounded-full font-medium ${brand.tagColor}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-dark group-hover:translate-x-1 transition-all duration-300 shrink-0"
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-dark text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-3xl font-light mb-2">не нашли нужный бренд?</h3>
          <p className="text-white/40 text-sm">напишите нам — мы рассмотрим возможность добавления</p>
        </div>
        <Link
          to="/stores"
          className="shrink-0 inline-flex items-center gap-2 border border-white/30 text-white text-sm tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-dark transition-all duration-300"
        >
          связаться <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}