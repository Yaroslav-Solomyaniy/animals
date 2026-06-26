import { redirect } from 'next/navigation'

export default function AdminVolunteerRequestsPage() {
  redirect('/admin/submissions?type=volunteer')
}
