import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'

// ── Вынесен за пределы Catalog — исправляет ошибку static-components ──
function FiltersContent({ categories, skins, category, skin, brand, maxPrice, updateParam }) {
  return (
    <div className="space-y-6">

      {/* Категория */}
      <div>
        <h3 className="font-heading text-lg font-light mb-3 lowercase">категория</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => updateParam('category', '')}
              className="accent-primary"
            />
            <span className="text-sm">все категории</span>
          </label>
          {categories?.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={category === cat.slug}
                onChange={() => updateParam('category', cat.slug)}
                className="accent-primary"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Тип кожи */}
      <div>
        <h3 className="font-heading text-lg font-light mb-3 lowercase">тип кожи</h3>
        <div className="space-y-2">
          {skins.map(s => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="skin"
                checked={skin === s.value}
                onChange={() => updateParam('skin', s.value)}
                className="accent-primary"
              />
              <span className="text-sm">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Бренд */}
      <div>
        <h3 className="font-heading text-lg font-light mb-3 lowercase">бренд</h3>
        <div className="space-y-2">
          {['Some By Mi', 'Bielenda', 'Vitex', 'Elizavecca', 'Missha', 'Belkosmex'].map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={brand === b}
                onChange={() => updateParam('brand', brand === b ? '' : b)}
                className="accent-primary"
              />
              <span className="text-sm">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div>
        <h3 className="font-heading text-lg font-light mb-3 lowercase">
          цена до: <span className="text-primary">{maxPrice} ₽</span>
        </h3>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={maxPrice}
          onChange={e => updateParam('maxPrice', e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 ₽</span>
          <span>5000 ₽</span>
        </div>
      </div>
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
    const handler = () => {
      if (window.innerWidth >= 768) setFiltersOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (filtersOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams)
    if (value) params[key] = value
    else delete params[key]
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

  const hasFilters = category || brand || skin || search

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

  const skins = [
    { value: '',          label: 'Все типы' },
    { value: 'dry',       label: 'Сухая' },
    { value: 'oily',      label: 'Жирная' },
    { value: 'combo',     label: 'Комбинированная' },
    { value: 'sensitive', label: 'Чувствительная' },
    { value: 'all',       label: 'Универсальная' },
  ]

  // Пропсы для FiltersContent
  const filterProps = { categories, skins, category, skin, brand, maxPrice, updateParam }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title">каталог</h1>
        <p className="text-gray-400 text-sm mt-1">
          вся корейская и европейская косметика в одном месте
        </p>
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
            onChange={e => updateParam('search', e.target.value)}
          />
        </div>

        <select
          className="input max-w-[200px]"
          value={sort}
          onChange={e => updateParam('sort', e.target.value)}
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

        {/* Боковая панель — только десктоп */}
        {filtersOpen && (
          <aside className="hidden md:block w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <FiltersContent {...filterProps} />
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
                  найдено:{' '}
                  <span className="font-medium text-dark">{data?.total || 0}</span> товаров
                  {data?.pages > 1 && (
                    <span className="ml-2 text-gray-300">
                      · страница {page} из {data.pages}
                    </span>
                  )}
                </p>
                {isFetching && !isLoading && (
                  <span className="text-xs text-gray-400 animate-pulse">обновление...</span>
                )}
              </div>

              {data?.products?.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 mb-2">товары не найдены</p>
                  <p className="text-sm text-gray-300 mb-4">
                    попробуйте изменить параметры поиска
                  </p>
                  <button onClick={resetAll} className="btn-primary">
                    сбросить фильтры
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-4 items-stretch transition-opacity duration-200 ${
                    isFetching ? 'opacity-60' : 'opacity-100'
                  } ${
                    filtersOpen
                      ? 'grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
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

      {/* Модальное окно фильтров — только мобильные */}
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
            <FiltersContent {...filterProps} />
          </div>

          <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3 bg-white">
            <button onClick={resetAll} className="btn-outline flex-1">
              Сбросить
            </button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="btn-primary flex-1"
            >
              Показать товары{data?.total ? ` (${data.total})` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}