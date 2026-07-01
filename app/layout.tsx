import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import AdminShell from '@/components/admin/AdminShell'
import AuthHashRedirect from '@/components/AuthHashRedirect'
import { FeatureFlagsProvider } from '@/components/FeatureFlagsProvider'
import { getSiteSettings } from '@/lib/site-settings'
import { SITE_NAME } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: `${SITE_NAME} | Допомога та новий дім для тварин`,
  description:
    'Офіційний сайт центру допомоги тваринам у Черкасах. Інформація про адопцію, допомогу тваринам, підтримку ініціатив, волонтерство та відповідальне поводження з тваринами.',
  icons: [
    { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    { url: '/favicon.ico', type: 'image/x-icon' },
  ],
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const flags = await getSiteSettings()

  return (
    <html
      lang="uk"
      className={cn('h-full', 'font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <NuqsAdapter defaultOptions={{ clearOnDefault: true, scroll: false, shallow: true }}>
          <FeatureFlagsProvider flags={flags}>
            <AuthHashRedirect />
            <AdminShell>{children}</AdminShell>
          </FeatureFlagsProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
