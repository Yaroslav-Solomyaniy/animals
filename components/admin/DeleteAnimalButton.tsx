'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteAnimalAction } from '@/app/admin/animals/actions'

export function DeleteAnimalButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Видалити «${name}»? Всі фото будуть видалені з R2. Цю дію не можна скасувати.`)) return
    setPending(true)
    const result = await deleteAnimalAction(id)
    if (!result.ok) {
      alert(result.error)
      setPending(false)
      return
    }
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      title="Видалити тварину"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  )
}
