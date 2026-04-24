import Link from 'next/link'
import { Newspaper, PawPrint, ScrollText } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Огляд"
        title="Адмін панель"
        description="Нормальна структура адмінки: окремі розділи, таблиці списків і окремі сторінки створення та редагування."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            href: '/admin/animals',
            title: 'Тварини',
            text: 'Список тварин, сторінка створення нового запису і окремі сторінки редагування.',
            icon: PawPrint,
          },
          {
            href: '/admin/news',
            title: 'Новини',
            text: 'Табличний список новин з окремими маршрутами new/edit.',
            icon: Newspaper,
          },
          {
            href: '/admin/reports',
            title: 'Звіти',
            text: 'Окремий список звітів і сторінки створення та редагування.',
            icon: ScrollText,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_20px_60px_rgba(242,116,56,0.12)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-slate-500">{item.text}</p>
            </Link>
          )
        })}
      </div>
    </AdminAuthGate>
  )
}
