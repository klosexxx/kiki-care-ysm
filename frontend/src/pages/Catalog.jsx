import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import { useState } from 'react'

const BRANDS = [
  'JIGOTT', 'CELIMAX', 'Esthetic House', 'LEBELAGE',
  'Physicians Formula', 'Holika Holika', 'ВИТЭКС', 'LaDor',
  'Med2b', 'Dr.Althea', "A'pieu", 'ARTDECO',
  'Snake', 'БЕЛИТА', 'Brazilla', 'RELOUIS',
  'Mi-Ri-Ne', 'FRUDIA', 'Ekel', 'TOCOBO',
  'Coco Blues', 'Peach Waterdrop',
]

const SKINS = [
  { value: '',            label: 'Все типы' },
  { value: 'dry',         label: 'Сухая' },
  { value: 'oily',        label: 'Жирная' },
  { value: 'combination', label: 'Комбинированная' },
  { value: 'sensitive',   label: 'Чувствительная' },
  { value: 'normal',      label: 'Нормальная' },
  { value: 'mature',      label: 'Зрелая' },
  { value: 'problem',     label: 'Проблемная' },
  { value: 'all',         label: 'Универсальная' },
]

function FilterRow({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{label}</p>
      {children}
    </div>
  )
}

function RadioItem({ value, current, label, onChange }) {
  const checked = current === value
  return (
    <button
      type="button"
      onClick={() => onChange(checked ? '' : value)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
        checked
          ? 'bg-dark text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
        checked ? 'border-white' : 'border-gray-300'
      }`}>
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  )
}

function CheckItem({ value, current, label, onChange }) {
  const checked = current === value
  return (
    <button
      type="button"
      onClick={() => onChange(checked ? '' : value)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
        checked
          ? 'bg-dark text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span className={`w-3.5 h-3.5 rounded border-2 shrink-0 flex items-center justify-center ${
        checked ? 'border-white bg-white/20' : 'border-gray-300'
      }`}>
        {checked && (
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
            <path d="M1.5 5.5 L4 8 L8.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

function FiltersContent({ categories, category, skin, brand, maxPrice, setParam, resetAll }) {
  return (
    <div className="space-y-6">

      <FilterRow label="Категория">
        <div className="space-y-0.5">
          <RadioItem name="category" value="" current={category} label="Все категории" onChange={v => setParam('category', v)} />
          {categories?.map(cat => (
            <RadioItem key={cat.id} name="category" value={cat.slug} current={category} label={cat.name} onChange={v => setParam('category', v)} />
          ))}
        </div>
      </FilterRow>

      <FilterRow label="Тип кожи">
        <div className="space-y-0.5">
          {SKINS.map(s => (
            <RadioItem key={s.value} name="skin" value={s.value} current={skin} label={s.label} onChange={v => setParam('skin', v)} />
          ))}
        </div>
      </FilterRow>

      <FilterRow label="Бренд">
        <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map(b => (
            <CheckItem key={b} value={b} current={brand} label={b} onChange={v => setParam('brand', v)} />
          ))}
        </div>
      </FilterRow>

      <FilterRow label={`Цена до: ${maxPrice} ₽`}>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={maxPrice}
          onChange={e => setParam('maxPrice', e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 ₽</span>
          <span>5 000 ₽</span>
        </div>
      </FilterRow>

      <button
        onClick={resetAll}
        className="w-full btn-outline text-sm flex items-center justify-center gap-2"
      >
        <X size={14} /> Сбросить фильтры
      </button>

    </div>
  )
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const page     = parseInt(searchParams.get('page')     || '1')
  const category = searchParams.get('category')          || ''
  const brand    = searchParams.get('brand')             || ''
  const skin     = searchParams.get('skin')              || ''
  const maxPrice = searchParams.get('maxPrice')          || '5000'
  const search   = searchParams.get('search')            || ''
  const sort     = searchParams.get('sort')              || ''

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setFiltersOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = filtersOpen && window.innerWidth < 768 ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams)
    if (value && !(key === 'maxPrice' && value === '5000')) {
      params[key] = value
    } else {
      delete params[key]
    }
    params.page = '1'
    setSearchParams(params)
  }

  const changePage = (newPage) => {
    const params = Object.fromEntries(searchParams)
    params.page = String(newPage)
    setSearchParams(params)
  }

  const resetAll = () => {
    setSearchParams({ page: '1' })
    setFiltersOpen(false)
  }

  const hasFilters = category || brand || skin || search || (maxPrice && maxPrice !== '5000')

  const filterProps = { categories: undefined, category, skin, brand, maxPrice, setParam, resetAll }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', page, category, brand, skin, maxPrice, search, sort],
    queryFn: () => api.get('/products', {
      params: { page, category, brand, skin, maxPrice, search, sort, limit: 12 }
    }).then(r => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">каталог</h1>
        <p className="text-gray-400 text-sm mt-1">вся корейская и европейская косметика в одном месте</p>
      </div>

      {/* Панель управления */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию или бренду..."
            className="input pl-10"
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
        </div>

        <select
          className="input max-w-[200px]"
          value={sort}
          onChange={e => setParam('sort', e.target.value)}
        >
          <option value="">По умолчанию</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
          <option value="rating">По рейтингу</option>
          <option value="name">По названию</option>
        </select>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`btn flex items-center gap-2 border-2 transition-colors ${
            filtersOpen
              ? 'border-dark bg-dark text-white'
              : 'border-dark text-dark hover:bg-dark hover:text-white'
          }`}
        >
          <SlidersHorizontal size={16} />
          фильтры
          {hasFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>

        {hasFilters && (
          <button
            onClick={resetAll}
            className="btn flex items-center gap-1 text-sm text-red-400 border-2 border-red-200 hover:bg-red-50"
          >
            <X size={14} /> сбросить
          </button>
        )}
      </div>

      {/* Контент */}
      <div className="flex gap-8">

        {/* Боковая панель — десктоп */}
        {filtersOpen && (
          <aside className="hidden md:block w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <FiltersContent {...filterProps} categories={categories} />
            </div>
          </aside>
        )}

        {/* Товары */}
        <div className="flex-1">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                  найдено: <span className="font-medium text-dark">{data?.total || 0}</span> товаров
                  {data?.pages > 1 && (
                    <span className="ml-2 text-gray-300">· страница {page} из {data.pages}</span>
                  )}
                </p>
                {isFetching && !isLoading && (
                  <span className="text-xs text-gray-400 animate-pulse">обновление...</span>
                )}
              </div>

              {data?.products?.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 mb-2">товары не найдены</p>
                  <p className="text-sm text-gray-300 mb-4">попробуйте изменить параметры поиска</p>
                  <button onClick={resetAll} className="btn-primary">сбросить фильтры</button>
                </div>
              ) : (
                <div className={`grid gap-4 items-stretch transition-opacity duration-200 ${
                  isFetching ? 'opacity-60' : 'opacity-100'
                } ${
                  filtersOpen
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {data?.products?.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              <Pagination page={page} pages={data?.pages || 1} onChange={changePage} />
            </>
          )}
        </div>
      </div>

      {/* Мобильное меню фильтров */}
      {filtersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="font-heading text-xl font-semibold">Фильтры</h2>
            <button
              onClick={() => setFiltersOpen(false)}
              className="p-2 text-gray-400 hover:text-dark transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FiltersContent {...filterProps} categories={categories} />
          </div>

          <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => setFiltersOpen(false)}
              className="btn-primary w-full"
            >
              Показать товары{data?.total ? ` (${data.total})` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}