'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { searchAnimalsAction } from '@/app/admin/news/actions'
import type { AnimalWithPhoto } from '@/lib/admin-types'

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  // Fetch only when query has at least 3 chars
  useEffect(() => {
    if (!open || query.length < 3) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setAnimals([])
      setIsLoading(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await searchAnimalsAction(queryRef.current)
        setAnimals(results)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [open, query])

  function handleClose() {
    onOpenChange(false)
    setQuery('')
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

        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-5 sm:grid-cols-3" style={{ alignContent: 'start' }}>
          {query.length < 3 ? (
            <div className="flex items-center justify-center py-16 sm:col-span-3">
              <p className="text-sm font-semibold text-slate-400">Введіть мінімум 3 символи для пошуку</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16 sm:col-span-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : animals.length > 0 ? (
            animals.map((animal) => (
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
