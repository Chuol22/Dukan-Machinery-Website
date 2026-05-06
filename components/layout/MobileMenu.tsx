// components/MobileMenu.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSelector from './LanguageSelector'
import ModeToggle from './ModeToggle'


interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{ name: string; href: string }>
}

export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      onClose()
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-neutral-900 shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-lg font-bold">Menu</span>
                <div className="flex items-center space-x-2">
                  <LanguageSelector />
                  <ModeToggle />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname?.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`block px-6 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-4 border-primary'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  © 2024 Dukan Machinery
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}