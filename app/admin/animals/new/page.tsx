import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { AnimalForm } from '@/components/admin/admin-forms'

export default function NewAnimalPage() {
  return (
    <AdminAuthGate>
      <AdminPageHeader eyebrow="Тварини" title="Додати тварину" description="Окрема сторінка створення нового запису." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <AnimalForm mode="create" />
      </div>
    </AdminAuthGate>
  )
}
