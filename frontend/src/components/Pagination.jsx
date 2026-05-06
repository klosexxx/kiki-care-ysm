import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-2 rounded-full border border-gray-200 disabled:opacity-30 hover:border-primary hover:text-primary transition-colors">
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary hover:text-primary'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages} className="p-2 rounded-full border border-gray-200 disabled:opacity-30 hover:border-primary hover:text-primary transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  )
}