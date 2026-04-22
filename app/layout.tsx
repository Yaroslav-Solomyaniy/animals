import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Центр надання допомоги безпритульним тваринам',
  description: 'Сайт центру допомоги безпритульним тваринам у Черкасах',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={cn("h-full", "font-sans", geist.variable)} suppressHydrationWarning>
      <head>
      </head>
      <body className="min-h-full font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="storybook-bg flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
