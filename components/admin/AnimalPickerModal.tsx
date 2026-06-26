'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { searchAnimalsAction } from '@/app/admin/news/actions'
import type { AnimalWithPhoto } from '@/lib/admin-types'

const PAGE_SIZE = 6

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedId: string | null
  onSelect: (animal: AnimalWithPhoto) => void
}

export function AnimalPickerModal({ open, onOpenChange, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [animals, setAnimals] = useState<AnimalWithPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  const totalPages = Math.ceil(animals.length / PAGE_SIZE)
  const pageAnimals = animals.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  useEffect(() => {
    if (!open) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setAnimals([])
      setIsLoading(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    setIsLoading(true)
    setPage(0)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchAnimalsAction(queryRef.current)
        setAnimals(results)
      } finally {
        setIsLoading(false)
      }
    }, query ? 300 : 0)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [open, query])

  function handleClose() {
    onOpenChange(false)
    setQuery('')
    setPage(0)
  }

  function handleSelect(animal: AnimalWithPhoto) {
    onSelect(animal)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-4 pr-14">
          <DialogTitle>Обрати тварину</DialogTitle>
          <DialogDescription>Обери тварину з каталогу</DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b border-slate-100 px-5 py-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук по імені..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3" style={{ alignContent: 'start' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 sm:col-span-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : pageAnimals.length > 0 ? (
            pageAnimals.map((animal) => (
              <button
                key={animal.id}
                type="button"
                onClick={() => handleSelect(animal)}
                className={`group relative w-full overflow-hidden rounded-2xl border p-0 text-left transition hover:border-primary hover:shadow-[0_4px_20px_rgba(242,116,56,0.12)] ${
                  selectedId === animal.id ? 'border-2 border-primary' : 'border border-slate-200'
                }`}
              >
                <AnimalCard animal={animal} />
                {selectedId === animal.id && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-bold text-slate-500 sm:col-span-3">
              {query ? `Нічого не знайдено за «${query}»` : 'Тварин немає'}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-slate-400">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function AnimalCard({ animal }: { animal: AnimalWithPhoto }) {
  return (
    <div className="overflow-hidden rounded-[inherit] bg-white">
      <div className="aspect-[3/4] w-full overflow-hidden bg-orange-50">
        {animal.photo_url ? (
          <img
            src={animal.photo_url}
            alt={animal.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            {animal.gender === 'female' ? '🐱' : '🐶'}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate font-black leading-5 text-gray-950">{animal.name || 'Без імені'}</p>
        {animal.approximate_age_label && (
          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            {animal.approximate_age_label} · {animal.gender === 'female' ? 'Дівчинка' : 'Хлопчик'}
          </p>
        )}
      </div>
    </div>
  )
}
