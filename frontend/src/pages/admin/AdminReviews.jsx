import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import StarRating from '../../components/StarRating'

export default function AdminReviews() {
  const queryClient = useQueryClient()

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/admin/reviews').then(r => r.data),
  })

  const approve = useMutation({
    mutationFn: (id) => api.put(`/admin/reviews/${id}/approve`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Отзыв опубликован') },
  })

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast('Отзыв удалён') },
  })

  if (reviews.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-4xl mb-3">✓</p>
      <p>нет отзывов на модерации</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">отзывов на модерации: {reviews.length}</p>
      {reviews.map(review => (
        <div key={review.id} className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{review.product_title}</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-sm">{review.user_name}</span>
                <StarRating rating={review.rating} size={13} />
              </div>
              <p className="text-gray-600 text-sm">{review.text}</p>
              <p className="text-xs text-gray-300 mt-2">{new Date(review.created_at).toLocaleString('ru-RU')}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => approve.mutate(review.id)} className="flex items-center gap-1 text-xs bg-green-100 text-green-600 hover:bg-green-200 px-3 py-2 rounded-full transition-colors">
                <Check size={12} /> опубликовать
              </button>
              <button onClick={() => remove.mutate(review.id)} className="flex items-center gap-1 text-xs bg-red-100 text-red-400 hover:bg-red-200 px-3 py-2 rounded-full transition-colors">
                <X size={12} /> удалить
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}