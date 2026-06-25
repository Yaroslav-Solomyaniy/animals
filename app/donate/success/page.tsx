import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PawPrint, Sparkles, Star } from 'lucide-react'
import type { Metadata } from 'next'
import SuccessCard from './SuccessCard'

export const metadata: Metadata = {
  title: 'Дякуємо за підтримку! | Центр допомоги тваринам',
}

export default async function DonateSuccessPage() {
  const cookieStore = await cookies()
  const pending = cookieStore.get('donation_pending')

  if (!pending?.value) {
    redirect('/donate')
  }

  return (
    <main className="relative min-h-screen bg-[#fff7ed] text-gray-950">

      {/* Peach blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-orange-300/55 blur-[90px]" />
        <div className="absolute -right-40 top-1/4 h-[480px] w-[480px] rounded-full bg-rose-300/50 blur-[90px]" />
        <div className="absolute bottom-[-80px] left-1/3 h-[420px] w-[420px] rounded-full bg-amber-300/55 blur-[90px]" />
      </div>

      {/* Floating paw prints */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <PawPrint className="absolute left-[8%] top-[12%] h-8 w-8 rotate-[-20deg] text-orange-300/50" />
        <PawPrint className="absolute right-[10%] top-[18%] h-6 w-6 rotate-[25deg] text-rose-300/45" />
        <PawPrint className="absolute left-[15%] top-[55%] h-5 w-5 rotate-[10deg] text-orange-200/60" />
        <PawPrint className="absolute right-[6%] top-[60%] h-10 w-10 rotate-[-15deg] text-amber-300/40" />
        <PawPrint className="absolute left-[4%] bottom-[20%] h-7 w-7 rotate-[30deg] text-orange-300/50" />
        <PawPrint className="absolute right-[18%] bottom-[15%] h-6 w-6 rotate-[-10deg] text-rose-200/55" />
        <Star className="absolute left-[30%] top-[8%] h-4 w-4 text-amber-400/50" />
        <Star className="absolute right-[25%] top-[6%] h-3 w-3 text-orange-400/45" />
        <Sparkles className="absolute right-[30%] bottom-[25%] h-5 w-5 text-rose-300/45" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-24">
        <SuccessCard />
      </div>
    </main>
  )
}
