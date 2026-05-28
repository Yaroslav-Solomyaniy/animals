import AdminAnimalsClient from '@/app/admin/animals/AdminAnimalsClient'
import { getAdminAnimalsPageData, loadAdminAnimalFilters } from '@/lib/admin-animals'

export default async function AdminAnimalsPage(props: PageProps<'/admin/animals'>) {
  const filters = await loadAdminAnimalFilters(props.searchParams)
  const data = await getAdminAnimalsPageData(filters)

  return <AdminAnimalsClient {...data} filters={filters} />
}
