'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, FileVideo, Link2, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { Input } from '@/components/ui/FormControls'
import { Field } from '@/components/admin/forms/shared'

// FFmpeg types (loaded dynamically)
type FFmpegInstance = {
  on: (event: string, cb: (args: { progress: number }) => void) => void
  load: (opts: { coreURL: string; wasmURL: string }) => Promise<void>
  writeFile: (name: string, data: Uint8Array) => Promise<void>
  exec: (args: string[]) => Promise<void>
  readFile: (name: string) => Promise<Uint8Array>
  deleteFile: (name: string) => Promise<void>
}

type VideoMode = 'url' | 'file'

type Props = {
  src: string
  title: string
  caption?: string
  r2Key?: string
  onUpdate: (patch: { src?: string; title?: string; caption?: string; r2Key?: string }) => void
  onUpload: (file: File) => Promise<{ r2Key: string; publicUrl: string } | null>
  onDelete: (r2Key: string | undefined) => Promise<boolean>
}

const FFMPEG_CORE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js'
const FFMPEG_WASM_URL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'

export function VideoUploader({ src, title, caption, r2Key, onUpdate, onUpload, onDelete }: Props) {
  const [mode, setMode] = useState<VideoMode>(r2Key ? 'file' : 'url')
  const [phase, setPhase] = useState<'idle' | 'loading-ffmpeg' | 'compressing' | 'uploading'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const ffmpegRef = useRef<FFmpegInstance | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isUploaded = !!r2Key
  const isBusy = phase !== 'idle'

  async function getFFmpeg(): Promise<FFmpegInstance> {
    if (ffmpegRef.current) return ffmpegRef.current

    setPhase('loading-ffmpeg')
    setProgress(0)

    // dynamic import so FFmpeg doesn't load on page load
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const ffmpeg = new FFmpeg() as unknown as FFmpegInstance
    ffmpeg.on('progress', ({ progress: p }) => {
      setProgress(Math.round(p * 100))
    })
    await ffmpeg.load({ coreURL: FFMPEG_CORE_URL, wasmURL: FFMPEG_WASM_URL })
    ffmpegRef.current = ffmpeg
    return ffmpeg
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.currentTarget.value = ''
    if (!file) return

    setError(null)

    try {
      // 1. Load FFmpeg
      const ffmpeg = await getFFmpeg()

      // 2. Compress
      setPhase('compressing')
      setProgress(0)

      const { fetchFile } = await import('@ffmpeg/util')
      await ffmpeg.writeFile('input', await fetchFile(file))
      await ffmpeg.exec([
        '-i', 'input',
        '-vf', 'scale=-2:720',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '28',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        'output.mp4',
      ])
      const data = await ffmpeg.readFile('output.mp4')
      await ffmpeg.deleteFile('input')
      await ffmpeg.deleteFile('output.mp4')

      const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' })
      const compressed = new File([blob], 'video.mp4', { type: 'video/mp4' })

      // 3. Upload
      setPhase('uploading')
      setProgress(0)
      const result = await onUpload(compressed)
      if (!result) throw new Error('Помилка завантаження на сервер')

      onUpdate({ src: result.publicUrl, r2Key: result.r2Key })
      setPhase('idle')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Помилка')
      setPhase('idle')
    }
  }

  async function handleDelete() {
    if (!r2Key) return
    const ok = await onDelete(r2Key)
    if (ok) onUpdate({ src: '', r2Key: undefined })
  }

  const phaseLabel: Record<typeof phase, string> = {
    idle: '',
    'loading-ffmpeg': 'Завантаження FFmpeg…',
    compressing: `Стискання… ${progress}%`,
    uploading: 'Завантаження на сервер…',
  }

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {(['url', 'file'] as VideoMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition ${
              mode === m
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {m === 'url' ? (
              <><Link2 className="h-3.5 w-3.5" /> Посилання</>
            ) : (
              <><FileVideo className="h-3.5 w-3.5" /> Файл</>
            )}
          </button>
        ))}
      </div>

      {mode === 'url' ? (
        <Field label="URL відео" hint="YouTube або Vimeo">
          <Input
            value={src}
            onChange={(e) => onUpdate({ src: e.target.value, r2Key: undefined })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {isUploaded ? (
            /* uploaded video preview */
            <div className="relative aspect-video bg-slate-900">
              <video src={src} controls className="h-full w-full" />
              <button
                type="button"
                onClick={handleDelete}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : isBusy ? (
            /* progress state */
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-bold text-slate-600">{phaseLabel[phase]}</p>
              {(phase === 'compressing') && (
                <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            /* pick file zone */
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-10 text-slate-400 transition hover:text-primary">
              <UploadCloud className="h-8 w-8" />
              <span className="text-sm font-bold">Обрати відео</span>
              <span className="text-xs text-slate-400">MP4, MOV, AVI — буде стиснуто до H.264 720p</span>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          )}
          {error && <p className="px-3 pb-3 text-xs font-bold text-red-500">{error}</p>}
        </div>
      )}

      {/* Common fields */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Назва відео">
          <Input value={title} onChange={(e) => onUpdate({ title: e.target.value })} />
        </Field>
        <Field label="Підпис">
          <Input value={caption ?? ''} onChange={(e) => onUpdate({ caption: e.target.value })} />
        </Field>
      </div>
    </div>
  )
}
