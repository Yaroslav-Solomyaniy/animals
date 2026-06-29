import { listAdminsAction } from './actions'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminAdministratorsClient from './AdminAdministratorsClient'

export default async function AdministratorsPage() {
  const users = await listAdminsAction()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Керування доступом"
        title="Адміністратори"
        description="Запрошуйте нових адміністраторів та керуйте існуючими."
      />
      <AdminAdministratorsClient users={users} />
    </div>
  )
}
