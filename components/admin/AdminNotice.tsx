import { AlertCircle } from 'lucide-react'

export default function AdminNotice({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="inline-flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-primary">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
