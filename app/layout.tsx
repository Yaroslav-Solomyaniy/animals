import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Центр надання допомоги безпритульним тваринам',
  description: 'Сайт центру допомоги безпритульним тваринам у Черкасах',
}

export default function RootLayout({children,}: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk" className={cn("h-full", "font-sans", geist.variable)} suppressHydrationWarning>
        <body className="min-h-full font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <AdminShell>{children}</AdminShell>
        </body>
        </html>
    )
}
