import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Адмін панель | Shelter',
  description: 'Внутрішня адмін-панель для керування сайтом притулку.',
}

export default function AdminLayout(props: LayoutProps<'/admin'>) {
  return props.children
}
