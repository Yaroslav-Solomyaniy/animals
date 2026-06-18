'use client'

import { useQueryState, parseAsInteger } from 'nuqs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  totalPages: number
}

export default function Pagination({ totalPages }: PaginationProps) {
  const [currentPage, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false, scroll: false }),
  )

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-600"
        aria-label="Попередня сторінка"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setPage(page)}
          className={[
            'flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-extrabold transition',
            page === currentPage
              ? 'border-primary bg-primary text-white shadow-[0_4px_14px_rgba(242,116,56,0.30)]'
              : 'border-gray-100 bg-white text-gray-700 shadow-sm hover:border-orange-200 hover:text-orange-600',
          ].join(' ')}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-600"
        aria-label="Наступна сторінка"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
