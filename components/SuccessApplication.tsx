'use client'

import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessApplication() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col items-center px-2 py-4 text-center sm:px-6 sm:py-6"
    >
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-secondary ring-1 ring-emerald-100">
        <CheckCircle2 className="h-9 w-9" />
      </span>

      <h3 className="text-2xl font-extrabold tracking-tight text-text-main">Заявку надіслано!</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        Дякуємо! Ми вже отримали вашу заявку та найближчим часом зв&apos;яжемося з вами, щоб узгодити деталі.
      </p>
    </motion.div>
  )
}
