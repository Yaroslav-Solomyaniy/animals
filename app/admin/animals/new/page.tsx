import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import AnimalEditorPage from '@/components/admin/AnimalEditorPage'

export default function NewAnimalPage() {
  return (
    <AdminAuthGate>
      <AnimalEditorPage />
    </AdminAuthGate>
  )
}
