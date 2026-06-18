'use client'

import { useQueryState, parseAsStringLiteral } from 'nuqs'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { orderValues } from './search-params'

export default function SortFilter() {
  const [order, setOrder] = useQueryState(
    'order',
    parseAsStringLiteral(orderValues).withDefault('desc').withOptions({ shallow: false, scroll: false }),
  )

  function toggle() {
    setOrder(order === 'desc' ? 'asc' : 'desc')
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2 text-sm font-extrabold text-gray-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
    >
      {order === 'desc' ? (
        <>
          <ArrowDown className="h-4 w-4" />
          Спочатку свіжіші
        </>
      ) : (
        <>
          <ArrowUp className="h-4 w-4" />
          Спочатку старіші
        </>
      )}
    </button>
  )
}
