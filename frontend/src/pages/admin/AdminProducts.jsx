import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const EMPTY = { title: '', brand: '', price: '', old_price: '', short_desc: '', description: '', inci: '', usage_guide: '', volume: '', skin_types: '[]', category_id: '', stock: '' }

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])

  const { data } = useQuery({ queryKey: ['products-admin'], queryFn: () => api.get('/products?limit=100').then(r => r.data) })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: () => api.get('/categories').then(r => r.data) })

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFiles([]); setModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ title: p.title, brand: p.brand || '', price: p.price, old_price: p.old_price || '', short_desc: p.short_desc || '', description: p.description || '', inci: p.inci || '', usage_guide: p.usage_guide || '', volume: p.volume || '', skin_types: JSON.stringify(p.skin_types || []), category_id: p.category_id || '', stock: p.stock || '' })
    setFiles([])
    setModal(true)
  }

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        return api.put(`/admin/products/${editing.id}`, { ...form, is_active: true })
      } else {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        files.forEach(f => fd.append('images', f))
        return api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
    },
    onSuccess: () => { toast.success(editing ? 'Товар обновлён' : 'Товар добавлен'); queryClient.invalidateQueries(['products-admin']); setModal(false) },
    onError: () => toast.error('Ошибка сохранения'),
  })

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => { toast('Товар скрыт'); queryClient.invalidateQueries(['products-admin']) },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400 text-sm">Всего товаров: {data?.total || 0}</p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Добавить товар</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.products?.map(p => (
          <div key={p.id} className="card p-4 flex gap-3">
            <img src={p.main_image ? `http://localhost:5000${p.main_image}` : 'https://placehold.co/80x80/faf8f5/c8a882?text=KC'} alt={p.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-2">{p.title}</p>
              <p className="text-primary font-semibold text-sm">{p.price} ₽</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(p)} className="text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1"><Pencil size={12} /> Изменить</button>
                <button onClick={() => remove.mutate(p.id)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={12} /> Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl font-bold">{editing ? 'Редактировать товар' : 'Новый товар'}</h2>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[['title', 'Название *'], ['brand', 'Бренд'], ['price', 'Цена *'], ['old_price', 'Старая цена'], ['volume', 'Объём'], ['stock', 'Остаток']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input className="input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} type={['price', 'old_price', 'stock'].includes(key) ? 'number' : 'text'} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <select className="input" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— Выберите —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {[['short_desc', 'Краткое описание', 2], ['description', 'Полное описание', 3], ['inci', 'Состав (INCI)', 2], ['usage_guide', 'Применение', 2]].map(([key, label, rows]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <textarea className="input resize-none" rows={rows} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              {!editing && (
                <div>
                  <label className="block text-sm font-medium mb-1">Фотографии (до 5 штук)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white file:cursor-pointer" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary flex-1">
                {save.isPending ? 'Сохраняем...' : 'Сохранить'}
              </button>
              <button onClick={() => setModal(false)} className="btn-outline">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}