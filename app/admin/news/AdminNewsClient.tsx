'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Calendar, Eye, EyeOff, ImageOff, Newspaper, Pencil, Trash2, X } from 'lucide-react'
import { deleteNewsPostAction } from '@/app/admin/news/actions'
import { Button } from '@/components/ui/Button'
import type { NewsPostRow } from '@/lib/admin-types'

function formatDate(value: string | null) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

function NewsPostCard({ post }: { post: NewsPostRow }) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const publishedLabel = formatDate(post.published_at)
  const isPublished = Boolean(post.is_published)

  async function handleDelete() {
    setIsDeleting(true)
    setDeleteError('')
    const result = await deleteNewsPostAction(post.id)
    if (!result.ok) {
      setDeleteError(result.error)
      setIsDeleting(false)
      setConfirmDelete(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="group grid gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-primary/30 hover:shadow-[0_12px_35px_rgba(242,116,56,0.08)] md:grid-cols-[200px_minmax(0,1fr)]">
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 md:aspect-auto md:h-full">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 text-slate-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs font-semibold">Немає обкладинки</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold',
                isPublished
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {isPublished ? 'Опубліковано' : 'Чернетка'}
            </span>
            {publishedLabel ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="h-3 w-3" />
                {publishedLabel}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {confirmDelete ? (
              <>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? 'Видалення...' : 'Підтвердити'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  showIcon={false}
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  <X className="h-4 w-4" />
                  Скасувати
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={`/admin/news/${post.id}`}
                  title="Редагувати новину"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  title="Видалити новину"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-extrabold leading-snug text-slate-950">{post.title}</h3>
          {post.excerpt ? (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
          ) : (
            <p className="mt-1 text-sm italic text-slate-400">Без короткого опису</p>
          )}
        </div>

        {deleteError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {deleteError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default function AdminNewsClient({ posts }: { posts: NewsPostRow[] }) {
  if (posts.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_18px_55px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-primary">
          <Newspaper className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-950">Новин поки немає</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Натисни «Додати новину» щоб створити перший запис.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4">
      {posts.map((post) => (
        <NewsPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
