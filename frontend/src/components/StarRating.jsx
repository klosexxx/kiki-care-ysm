import { Star } from 'lucide-react'

export default function StarRating({ rating, onRate, size = 20 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          className={`transition-colors ${onRate ? 'cursor-pointer hover:text-primary' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={star <= rating ? 'text-primary fill-primary' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  )
}