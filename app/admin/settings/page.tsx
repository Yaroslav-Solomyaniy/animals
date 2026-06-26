import { Settings } from 'lucide-react'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AdminSection } from '@/components/admin/AdminSection'
import AdminNotice from '@/components/admin/AdminNotice'
import { getSiteSettings } from '@/lib/site-settings'
import SettingsForm from './SettingsForm'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <AdminAuthGate>
      <AdminPageHeader
        eyebrow="Налаштування"
        title="Налаштування сайту"
        description="Керуйте загальними параметрами сайту: донати, суми, опис."
      />

      <div className="mt-6 flex flex-col gap-6">
        <AdminSection
          eyebrow="Налаштування сайту"
          title="Функції та відображення"
          description="Керуйте функціями сайту: донати, блок звітів та інші параметри."
        >
          <SettingsForm settings={settings} />
        </AdminSection>

        <AdminNotice>
          Зміни набирають чинності протягом 60 секунд (кеш сторінок). Вебхук Monobank налаштований на{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">
            /api/webhooks/monobank
          </code>
          .
        </AdminNotice>
      </div>
    </AdminAuthGate>
  )
}
