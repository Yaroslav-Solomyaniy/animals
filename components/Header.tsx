'use client'

import { useState } from 'react'
import { Globe, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Головна', href: '/' },
    { name: 'Книга хвостиків', href: '/animals' },
    { name: 'Послуги', href: '/services' },
    { name: 'Як можна допомогти', href: '/help-for-us' },
    { name: 'Звіти та новини', href: '/report-and-news' },
    { name: 'Контакти', href: '/contacts' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-semibold transition-colors ${
                    link.name === 'Adopt'
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-primary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full text-gray-500">
                UA/EN
              </span>
              <button className="border-2 border-primary text-primary px-6 py-2.5 rounded-xl font-bold text-[15px] hover:bg-primary hover:text-white transition-all transform active:scale-95">
                Підтримати
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-lg font-semibold text-gray-600 hover:text-primary hover:bg-gray-50 rounded-xl transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 text-lg font-bold text-gray-600">
                    <Globe className="w-5 h-5" />
                    <span>UA / EN</span>
                  </button>
                  <button className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20">
                    Donate Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
