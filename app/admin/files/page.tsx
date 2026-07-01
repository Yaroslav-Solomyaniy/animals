'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Download, ExternalLink,
  File, FileText, FileVideo, Folder, FolderTree, HardDrive,
  ImageIcon, LayoutList, Loader2, RefreshCw, Trash2, X,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { listFilesAction, getBucketStatsAction, deleteFileAction, getR2PublicUrlAction, checkFileReferencesAction } from './actions'
import type { FileReference } from './actions'
import type { R2Object, R2BucketStats } from '@/lib/r2'

// ─── Constants ───────────────────────────────────────────────────────────────
const R2_FREE_GB = 10
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'avi']
const DOC_EXTS   = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv']

function getExt(key: string) { return key.split('.').pop()?.toLowerCase() ?? '' }
function isImage(key: string) { return IMAGE_EXTS.includes(getExt(key)) }
function isVideo(key: string) { return VIDEO_EXTS.includes(getExt(key)) }

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1000 ** 2) return `${(bytes / 1000).toFixed(1)} KB`
  if (bytes < 1000 ** 3) return `${(bytes / 1000 ** 2).toFixed(1)} MB`
  return `${(bytes / 1000 ** 3).toFixed(2)} GB`
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fileName(key: string): string { return key.split('/').filter(Boolean).pop() ?? key }
function folderName(prefix: string): string { return prefix.replace(/\/$/, '').split('/').pop() ?? prefix }

// ─── File icon ────────────────────────────────────────────────────────────────
function FileIcon({ fileKey, className }: { fileKey: string; className?: string }) {
  if (isVideo(fileKey)) return <FileVideo className={className} />
  if (DOC_EXTS.includes(getExt(fileKey))) return <FileText className={className} />
  if (isImage(fileKey)) return <ImageIcon className={className} />
  return <File className={className} />
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  obj, objects, publicBase, onClose, onDelete,
}: {
  obj: R2Object
  objects: R2Object[]
  publicBase: string
  onClose: () => void
  onDelete: (obj: R2Object) => void
}) {
  const idx = objects.indexOf(obj)
  const [current, setCurrent] = useState(idx)
  const item = objects[current]
  const url = `${publicBase}/${item.key}`

  const prev = () => setCurrent(i => Math.max(0, i - 1))
  const next = () => setCurrent(i => Math.min(objects.length - 1, i + 1))

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex shrink-0 items-center justify-between gap-4 px-4 py-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white" title={fileName(item.key)}>{fileName(item.key)}</p>
          <p className="text-xs text-white/40">{formatBytes(item.size)} · {formatDate(item.lastModified)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
            title="Відкрити в новій вкладці"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={url}
            download
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
            title="Завантажити"
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            onClick={() => { onClose(); onDelete(item) }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition hover:bg-red-500/20 hover:text-red-400"
            title="Видалити"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="mx-1 h-4 w-px bg-white/20" />
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4"
        onClick={e => e.stopPropagation()}
      >
        {isImage(item.key) ? (
          <img
            key={item.key}
            src={url}
            alt={fileName(item.key)}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
        ) : isVideo(item.key) ? (
          <video
            key={item.key}
            src={url}
            controls
            className="max-h-full max-w-full rounded-lg shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <FileIcon fileKey={item.key} className="h-20 w-20 text-white/20" />
            <p className="text-sm font-semibold text-white/50">Перегляд недоступний</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              Відкрити файл
            </a>
          </div>
        )}

        {/* Prev / Next */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-black/40 text-white transition hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {current < objects.length - 1 && (
          <button
            onClick={next}
            className="absolute right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-black/40 text-white transition hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="shrink-0 pb-4 text-center text-xs font-semibold text-white/30">
        {current + 1} / {objects.length}
      </div>
    </div>
  )
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  name, refs, refsLoading, onConfirm, onCancel,
}: {
  name: string
  refs: FileReference[]
  refsLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const hasRefs = refs.length > 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${hasRefs ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
            <Trash2 className="h-5 w-5" />
          </div>
          <button onClick={onCancel} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h3 className="text-base font-extrabold text-slate-950">Видалити файл?</h3>
        <p className="mt-1 break-all text-sm text-slate-500">{name}</p>

        {refsLoading ? (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Перевіряємо використання...
          </div>
        ) : hasRefs ? (
          <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-bold text-orange-700">⚠️ Файл використовується:</p>
            <ul className="mt-1.5 space-y-1">
              {refs.map((ref, i) => (
                <li key={i} className="text-xs font-semibold text-orange-600">
                  {ref.type === 'animal_photo'
                    ? `🐾 ${ref.animalName}${ref.isMain ? ' (головне фото)' : ''}`
                    : ref.type === 'news_cover'
                    ? `📰 ${ref.postTitle}`
                    : ref.type === 'report_file'
                    ? `📊 ${ref.reportTitle}`
                    : `👤 ${ref.userName} (аватар)`}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-orange-500">Посилання буде очищено автоматично.</p>
          </div>
        ) : (
          <p className="mt-1 text-sm text-slate-400">Цю дію неможливо скасувати.</p>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            Скасувати
          </button>
          <button onClick={onConfirm} disabled={refsLoading} className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
            Видалити
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────
function Thumbnail({ obj, publicBase, onClick }: { obj: R2Object; publicBase: string; onClick: () => void }) {
  const url = `${publicBase}/${obj.key}`
  return (
    <button type="button" onClick={onClick} className="block w-full cursor-pointer">
      {isImage(obj.key) ? (
        <img
          src={url}
          alt={fileName(obj.key)}
          className="h-28 w-full rounded-lg object-cover transition hover:opacity-90"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="flex h-28 w-full items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200">
          <FileIcon fileKey={obj.key} className="h-10 w-10 text-slate-400" />
        </div>
      )}
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FilesPage() {
  const [prefix, setPrefix] = useState('')
  const [mode, setMode] = useState<'structure' | 'flat'>('structure')
  const [objects, setObjects] = useState<R2Object[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [stats, setStats] = useState<R2BucketStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [lightboxObj, setLightboxObj] = useState<R2Object | null>(null)
  const [toDelete, setToDelete] = useState<R2Object | null>(null)
  const [toDeleteRefs, setToDeleteRefs] = useState<FileReference[]>([])
  const [refsLoading, setRefsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [publicBase, setPublicBase] = useState('')

  const loadFiles = useCallback(async (p: string, flat = false) => {
    setLoading(true)
    setError('')
    const result = await listFilesAction(p, flat)
    if (result.error) setError(result.error)
    setObjects(result.objects.filter(o => o.key !== p))
    setFolders(flat ? [] : result.prefixes)
    setLoading(false)
  }, [])

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    const s = await getBucketStatsAction()
    setStats(s)
    setStatsLoading(false)
  }, [])

  useEffect(() => {
    getR2PublicUrlAction().then(setPublicBase)
    loadFiles('', mode === 'flat')
    loadStats()
  }, [loadFiles, loadStats, mode])

  async function navigate(newPrefix: string) {
    setPrefix(newPrefix)
    await loadFiles(newPrefix, mode === 'flat')
  }

  function switchMode(newMode: 'structure' | 'flat') {
    setMode(newMode)
    setPrefix('')
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    const result = await deleteFileAction(toDelete.key)
    setDeleting(false)
    setToDelete(null)
    if (result.ok) {
      setObjects(prev => prev.filter(o => o.key !== toDelete.key))
      loadStats()
    }
  }

  const breadcrumbParts = prefix ? prefix.replace(/\/$/, '').split('/') : []
  const usedGb = (stats?.totalSize ?? 0) / 1024 ** 3
  const usedPct = Math.min((usedGb / R2_FREE_GB) * 100, 100)

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Сховище" title="Файли" description="Управління файлами в Cloudflare R2" />

      {/* Storage bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-950">Cloudflare R2</p>
              {statsLoading ? (
                <p className="text-xs text-slate-400">Розраховуємо...</p>
              ) : (
                <p className="text-xs font-semibold text-slate-500">
                  {formatBytes(stats?.totalSize ?? 0)} використано з {R2_FREE_GB} GB · {stats?.objectCount ?? 0} файлів
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => { loadFiles(prefix); loadStats() }}
            className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${usedPct}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-[11px] font-semibold text-slate-400">0 GB</span>
          <span className="text-[11px] font-semibold text-slate-400">{R2_FREE_GB} GB</span>
        </div>
      </div>

      {/* Breadcrumb + mode toggle */}
      <div className="flex items-center justify-between gap-4">
        {mode === 'structure' ? (
          <div className="flex items-center gap-1 text-sm font-semibold">
            <button onClick={() => navigate('')} className={`cursor-pointer rounded px-1 transition hover:text-primary ${prefix === '' ? 'text-slate-950' : 'text-slate-400'}`}>
              Корінь
            </button>
            {breadcrumbParts.map((part, i) => {
              const partPrefix = breadcrumbParts.slice(0, i + 1).join('/') + '/'
              return (
                <span key={partPrefix} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <button
                    onClick={() => navigate(partPrefix)}
                    className={`cursor-pointer rounded px-1 transition hover:text-primary ${i === breadcrumbParts.length - 1 ? 'text-slate-950' : 'text-slate-400'}`}
                  >
                    {part}
                  </button>
                </span>
              )
            })}
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-400">Всі файли</p>
        )}

        {/* Mode toggle */}
        <div className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => switchMode('structure')}
            title="Структура папок"
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${mode === 'structure' ? 'bg-orange-50 text-primary' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            Структура
          </button>
          <button
            onClick={() => switchMode('flat')}
            title="Всі файли"
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${mode === 'flat' ? 'bg-orange-50 text-primary' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <LayoutList className="h-3.5 w-3.5" />
            Всі файли
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      ) : folders.length === 0 && objects.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-400">Папка порожня</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {folders.map(f => (
            <button
              key={f}
              onClick={() => navigate(f)}
              className="group flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:border-orange-200 hover:bg-orange-50/50"
            >
              <Folder className="h-12 w-12 text-orange-400 transition group-hover:text-primary" />
              <span className="w-full truncate text-xs font-bold text-slate-700">{folderName(f)}</span>
            </button>
          ))}

          {objects.map(obj => (
            <div key={obj.key} className="group relative flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300">
              <Thumbnail obj={obj} publicBase={publicBase} onClick={() => setLightboxObj(obj)} />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800" title={obj.key}>
                  {fileName(obj.key)}
                </p>
                {mode === 'flat' && obj.key.includes('/') && (
                  <p className="truncate text-[10px] font-semibold text-slate-300" title={obj.key}>
                    {obj.key.split('/').slice(0, -1).join('/')}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                  {formatBytes(obj.size)} · {formatDate(obj.lastModified)}
                </p>
              </div>
              <button
                onClick={async () => {
                  setToDelete(obj)
                  setToDeleteRefs([])
                  setRefsLoading(true)
                  const refs = await checkFileReferencesAction(obj.key)
                  setToDeleteRefs(refs)
                  setRefsLoading(false)
                }}
                className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-white/80 text-slate-300 opacity-0 shadow-sm backdrop-blur-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxObj && (
        <Lightbox
          obj={lightboxObj}
          objects={objects}
          publicBase={publicBase}
          onClose={() => setLightboxObj(null)}
          onDelete={async (obj) => {
            setLightboxObj(null)
            setToDelete(obj)
            setToDeleteRefs([])
            setRefsLoading(true)
            const refs = await checkFileReferencesAction(obj.key)
            setToDeleteRefs(refs)
            setRefsLoading(false)
          }}
        />
      )}

      {/* Confirm delete */}
      {toDelete && (
        <ConfirmDialog
          name={fileName(toDelete.key)}
          refs={toDeleteRefs}
          refsLoading={refsLoading}
          onConfirm={handleDelete}
          onCancel={() => { setToDelete(null); setToDeleteRefs([]) }}
        />
      )}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  )
}
