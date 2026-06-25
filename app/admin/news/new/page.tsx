import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { NewsForm } from '@/components/admin/forms/NewsForm'

export default async function NewNewsPage() {
  return (
    <AdminAuthGate>
      <NewsForm mode="create" />
    </AdminAuthGate>
  )
}
