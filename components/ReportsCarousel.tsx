'use client'

import { useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Download, FileText, ScrollText } from 'lucide-react'

type ReportFile = {
  src: string
  name: string
}

type Report = {
  id: string
  title: string
  period: string | null
  description: string | null
  files: ReportFile[]
  date: string
}

export default function ReportsCarousel({ reports }: { reports: Report[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return
    setIsDragging(false)
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
    trackRef.current.style.cursor = 'grabbing'
    trackRef.current.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current || e.buttons !== 1) return
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    if (Math.abs(walk) > 4) setIsDragging(true)
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUp = useCallback(() => {
    if (!trackRef.current) return
    trackRef.current.style.cursor = 'grab'
    trackRef.current.style.userSelect = ''
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-6">
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-orange-200 hover:text-primary"
        aria-label="Попередні"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-orange-200 hover:text-primary"
        aria-label="Наступні"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: 'grab' }}
      >
        {reports.map((report) => (
          <article
            key={report.id}
            className="shrink-0 rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_58%,#ecfeff_100%)] p-6 shadow-soft transition hover:border-orange-200 hover:shadow-[0_20px_60px_rgba(242,116,56,0.10)]"
            style={{ width: 'calc((100% - 40px) / 3)', minWidth: 'calc((100% - 40px) / 3)' }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <ScrollText className="h-5 w-5" />
              </span>
              {report.period && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-gray-400 shadow-sm">
                  {report.period}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-gray-950">{report.title}</h3>
            {report.description && (
              <p className="mt-2 text-sm leading-6 text-gray-600">{report.description}</p>
            )}

            {report.files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {report.files.map((file, i) => (
                  <a
                    key={i}
                    href={file.src}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (isDragging) e.preventDefault() }}
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition hover:border-primary/30 hover:bg-orange-50"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-primary" />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700 transition group-hover:text-primary">
                      {file.name}
                    </span>
                    <Download className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-primary" />
                  </a>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-slate-400">{report.date}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
